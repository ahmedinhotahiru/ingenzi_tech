# Tony — Ultrasound RAG Assistant (`RAG/`)

Tony is an AI assistant that acts as a **digital twin of a Philips HDI 5000 ultrasound machine**. It answers questions about the device's manuals, error codes, maintenance, and MRI topics, and can pull live device data (logs, self-tests, service dates) through the backend API. It is built as a **Retrieval-Augmented Generation (RAG)** agent on top of LangChain + OpenAI, with its knowledge stored in a **Postgres/pgvector** database (Neon).

This README covers **only the `RAG/` folder** — the chatbot/agent service. The Flask backend lives in `../backend/` and is maintained separately.

---

## Table of contents
1. [What this service is](#what-this-service-is)
2. [Architecture](#architecture)
3. [Two front doors: Chat UI + REST API](#two-front-doors)
4. [The agent & its tools](#the-agent--its-tools)
5. [Vector store & data model](#vector-store--data-model)
6. [Folder structure](#folder-structure)
7. [Environment variables](#environment-variables)
8. [Local setup & running](#local-setup--running)
9. [Seeding the vector store](#seeding-the-vector-store)
10. [REST API reference (`POST /chat`)](#rest-api-reference)
11. [Deployment (Render)](#deployment-render)
12. [How persistent memory works](#how-persistent-memory-works)
13. [Multi-device roadmap](#multi-device-roadmap)
14. [Troubleshooting](#troubleshooting)

---

## What this service is

- A **Chainlit** application ([chat_ultrasound_chroma.py](chat_ultrasound_chroma.py)) that runs a LangChain **tool-calling agent** (`gpt-4o`).
- The agent retrieves knowledge from four vector collections in **Neon Postgres (pgvector)** and calls the **backend Flask API** for live device operations.
- It exposes **two interfaces to the same agent**: the Chainlit chat UI *and* a plain JSON `POST /chat` endpoint for programmatic use.

> ℹ️ The filename is `chat_ultrasound_chroma.py` for historical reasons — the store was migrated **from Chroma to Postgres/pgvector**. It no longer uses Chroma.

---

## Architecture

```
                 ┌──────────────────────────────────────────────┐
                 │        RAG service (Chainlit + FastAPI)        │
                 │            chat_ultrasound_chroma.py           │
   Chat UI  ───▶ │  ┌────────────────────────────────────────┐  │
   (Chainlit)    │  │      LangChain tool-calling agent        │  │
                 │  │              (gpt-4o)                    │  │
   POST /chat ─▶ │  └───┬───────────────┬──────────────┬──────┘  │
   (REST API)    │      │               │              │         │
                 └──────┼───────────────┼──────────────┼─────────┘
                        │               │              │
              ┌─────────▼──────┐  ┌─────▼───────┐  ┌───▼──────────┐
              │ Neon Postgres  │  │ Backend API │  │ Other tools  │
              │   (pgvector)   │  │ (Flask,     │  │ • MRI model  │
              │ 4 collections  │  │  ../backend)│  │   (Modal)    │
              │ = RAG knowledge│  │ logs/self-  │  │ • Tavily web │
              │ + device mem   │  │ test/errors │  │ • OpenAI     │
              └────────────────┘  └─────────────┘  └──────────────┘
```

---

## Two front doors

Both interfaces call the **exact same agent, tools, and data** — they are just different presentation layers.

| Interface | How it's served | Use case |
|---|---|---|
| **Chainlit chat UI** | `chainlit run` serves the web UI at `/` | Standalone chat / embedded copilot widget in the dashboard |
| **`POST /chat` REST API** | Attached to Chainlit's FastAPI app via `from chainlit.server import app` | Integrate Tony into any custom frontend/service |

Because the REST endpoint is attached to the Chainlit server, **the Chainlit service must be running for the API to work** — even if you only use the API.

---

## The agent & its tools

The agent is a LangChain OpenAI-tools agent bound to the following tools (see `setup_chain` and `_get_rest_executor`):

| Tool name | Backed by | Purpose |
|---|---|---|
| `ultrasound_search` | Neon (`ultrasound_manuals`) | Retrieve from the ultrasound machine manuals |
| `maintenance_search` | Neon (`maintenance_manuals`) | Product specs, maintenance, disinfection, usage instructions |
| `device_history_search` | Neon (`device_history`) | Past logs, self-tests, previously looked-up errors (durable memory) |
| `get_error_code_description` | Backend `/api/lookup-code` → stored to `device_history` | Look up an error code's description |
| `retrieve_logs_from_api` | Backend `/api/retrieve-logs` → stored to `device_history` | Pull latest device logs |
| `initiate_self_test_from_api` | Backend `/api/self-test-report` → stored to `device_history` | Run a simulated self-test |
| `schedule_maintenance` | Backend `/api/last-service-date` (POST) | Set the next service date |
| `get_maintenance_info` | Backend `/api/last-service-date` (GET) | Report last/next service dates |
| `query_mri_model` | Modal endpoint (fine-tuned MedGemma) | Answer MRI-specific questions |
| `tavily_search` | Tavily API | General web search fallback |

The system prompt (in `chat_ultrasound_chroma.py`) instructs the agent when to use each tool, how to handle error codes, and to reply in the user's language.

---

## Vector store & data model

Knowledge is stored in **Neon Postgres with the `pgvector` extension** via `langchain_postgres.PGVector`. Four collections:

| Collection | Source (`RAG/…`) | Approx. vectors | Scope |
|---|---|---|---|
| `ultrasound_manuals` | `Manuals/` | ~2,145 | reference (brand + model) |
| `maintenance_manuals` | `Maintenance_docs/` | ~390 | reference (brand + model) |
| `error_manuals` | `Errors/` | ~18 | reference (brand + model) |
| `device_history` | `device_history/` seed + **runtime writes** | grows | device (brand + model + device_id + customer_id) |

**Fleet-ready metadata** — every stored document is tagged so the single-device store already supports many devices later:

```json
{
  "brand": "Philips",
  "model": "HDI-5000",
  "device_id": "HDI5000-DEMO-001",   // device_history only
  "customer_id": "default",          // device_history only (tenant/access control)
  "doc_type": "manual | error_code | maintenance | log | self_test | error_lookup",
  "timestamp": "ISO-8601"            // runtime docs
}
```

- **Reference docs** (manuals/errors/maintenance) are shared across customers → scoped by `brand` + `model`.
- **Device history** is per physical unit → scoped by `device_id` (globally unique serial) + `customer_id` (tenant).

The app **connects** to these collections at boot (no PDF processing at startup); they are populated once by [seed_pgvector.py](seed_pgvector.py).

---

## Folder structure

```
RAG/
├── chat_ultrasound_chroma.py   # main app: agent, tools, prompt, Chainlit UI, REST /chat endpoint
├── seed_pgvector.py            # one-time loader: PDFs → Neon pgvector
├── README.md                   # this file
├── chainlit.md                 # Chainlit welcome screen
├── feedback.py / feedback.jsonl# thumbs up/down feedback capture (note: file is ephemeral on Render)
├── modal_medgemma.py           # deploy script for the MRI MedGemma model (Modal)
├── Manuals/                    # source PDFs → ultrasound_manuals
├── Maintenance_docs/           # source PDFs → maintenance_manuals
├── Errors/                     # source PDFs → error_manuals
├── device_history/             # seed PDFs → device_history (self_reports.pdf, simulated_logs.pdf)
├── public/                     # icons for the Chainlit starter buttons
└── .chainlit/                  # Chainlit config
```

> `chroma_db/` no longer exists here — it was the old local Chroma store, removed after the pgvector migration.

---

## Environment variables

Set these in a `.env` (local) or in the Render service's **Environment** tab.

| Variable | Required | Purpose |
|---|---|---|
| `OPENAI_API_KEY` | ✅ | `gpt-4o` chat + `OpenAIEmbeddings` (embeddings). Must be an **active** key. |
| `DATABASE_URL` | ✅ | Neon Postgres connection (use the **direct** string, `?sslmode=require`). The app converts `postgresql://` → `postgresql+psycopg://` automatically. |
| `TAVILY_API_KEY` | ✅ | Web-search tool. **The app won't boot without it** (the tool is constructed at import). |
| `REACT_APP_BACKEND_URL` | ✅ (for device tools) | Base URL of the Flask backend. On Render use the **internal** URL `http://ingenzi-backend:10000`; locally e.g. `http://127.0.0.1:5000`. |
| `CHAT_API_KEY` | ⭐ recommended in prod | If set, `POST /chat` requires `Authorization: Bearer <key>`. If unset, the endpoint is open. |
| `MRI_MODAL_ENDPOINT` | optional | Modal endpoint for the MRI MedGemma model. |
| `MRI_MODAL_TOKEN` | optional | Bearer token for the MRI endpoint. |
| `DEVICE_BRAND` | optional (`Philips`) | Metadata tag for stored data. |
| `DEVICE_MODEL` | optional (`HDI-5000`) | Metadata tag. |
| `DEVICE_ID` | optional (`HDI5000-DEMO-001`) | Metadata tag for device history. |
| `CUSTOMER_ID` | optional (`default`) | Tenant tag for device history. |

---

## Local setup & running

**Prerequisites:** Python 3.11, a Neon Postgres project with `pgvector` enabled, an OpenAI key, a Tavily key, and (optionally) the backend running.

```bash
# 1. Install deps (from repo root; requirements.txt is at the root)
pip install -r ../requirements.txt

# 2. Provide env vars (PowerShell example)
$env:OPENAI_API_KEY  = "sk-..."
$env:DATABASE_URL    = "postgresql://user:pass@ep-xxx.us-west-2.aws.neon.tech/neondb?sslmode=require"
$env:TAVILY_API_KEY  = "tvly-..."
$env:REACT_APP_BACKEND_URL = "https://ingenzi-backend.onrender.com"   # or your local backend

# 3. Seed the vector store (first time only — see next section)
python seed_pgvector.py

# 4. Run the app (serves the chat UI AND the /chat endpoint)
chainlit run chat_ultrasound_chroma.py --port 8000
```

- Chat UI: <http://localhost:8000/>
- REST endpoint: `POST http://localhost:8000/chat`

---

## Seeding the vector store

`seed_pgvector.py` loads the PDFs from `Manuals/`, `Errors/`, `Maintenance_docs/`, and `device_history/` into Neon, tagged with the metadata schema. **Run it once** against a new database.

```bash
# Full seed (resets each collection first). Requires DATABASE_URL + OPENAI_API_KEY.
python seed_pgvector.py

# Refresh ONLY the reference manuals, WITHOUT wiping accumulated device history:
python seed_pgvector.py --skip-history
```

Notes:
- Embeddings are sent in batches of 200 chunks to stay under OpenAI's 300k-tokens-per-request limit.
- The seeder and the app must use the **same embedding model** (both use `OpenAIEmbeddings` defaults) or vectors won't line up.
- Verify counts in the Neon SQL editor:
  ```sql
  SELECT c.name, count(e.id) FROM langchain_pg_collection c
  LEFT JOIN langchain_pg_embedding e ON e.collection_id = c.uuid
  GROUP BY c.name ORDER BY c.name;
  ```
  Expected after a fresh seed: `ultrasound_manuals 2145`, `error_manuals 18`, `maintenance_manuals 390`, `device_history 11`.

---

## REST API reference

### `POST /chat`

Send a question, get the assistant's answer.

**Headers**
```
Content-Type: application/json
Authorization: Bearer <CHAT_API_KEY>   # only if CHAT_API_KEY is set on the server
```

**Request body**
```json
{
  "message": "What does error code 0065 mean?",
  "session_id": "optional-stable-id"
}
```
- `message` (string, required) — the user's question.
- `session_id` (string, optional) — pass a stable id to keep conversation memory across calls; omit for a stateless single-turn answer.

**Response** `200 OK`
```json
{ "response": "…the assistant's answer…", "session_id": "optional-stable-id" }
```

**Errors**
| Status | Body | Meaning |
|---|---|---|
| `401` | `{"error":"unauthorized"}` | Missing/wrong `Authorization` (when `CHAT_API_KEY` is set) |
| `400` | `{"error":"message is required"}` | Empty message |
| `500` | `{"error":"agent error: …"}` | Agent/tool failure |

**Examples**

curl:
```bash
curl -X POST https://ingenzi-chat.onrender.com/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $CHAT_API_KEY" \
  -d '{"message":"How do I run a self test?"}'
```

Python:
```python
import requests
r = requests.post(
    "https://ingenzi-chat.onrender.com/chat",
    headers={"Authorization": f"Bearer {CHAT_API_KEY}"},
    json={"message": "What does error code 0065 mean?", "session_id": "user-123"},
    timeout=120,
)
print(r.json()["response"])
```

> ⚠️ **Cold start & latency:** on the free chat instance the service sleeps when idle, so the **first request after a quiet period can take 30–60s**. Agent answers that use tools can also take 10–30s. Use a generous client timeout (≥120s). Session history is kept **in memory**, so it resets when the service restarts.

---

## Deployment (Render)

Two Render services (Oregon region):

| Service | Instance | Role |
|---|---|---|
| `ingenzi-chat` | Free | This RAG app. Public: <https://ingenzi-chat.onrender.com> · endpoint `/chat` |
| `ingenzi-backend` | Starter (paid) | Flask API (`../backend`). Public: <https://ingenzi-backend.onrender.com> |

- **Start command:** `chainlit run chat_ultrasound_chroma.py --host 0.0.0.0 --port $PORT -h`
- **Auto-deploy:** pushing to `main` redeploys automatically. There is no `render.yaml`/`Procfile` — settings live in the Render dashboard.
- **`REACT_APP_BACKEND_URL` = `http://ingenzi-backend:10000`** (internal) — chat→backend calls go over Render's private network to avoid Cloudflare rate-limiting (429) that happens on the public `*.onrender.com` URL. This is why the backend runs on a **paid** instance: free Render web services can *send* private-network requests but can't *receive* them.
- Ensure `DATABASE_URL`, `OPENAI_API_KEY`, `TAVILY_API_KEY`, and `CHAT_API_KEY` are set on the chat service.

---

## How persistent memory works

`device_history` is the agent's long-term memory. Whenever a user retrieves logs, runs a self-test, or looks up an error code, the result is written (with metadata) to the `device_history` collection.

Previously (with local Chroma) this was stored on the container's **ephemeral disk**, which Render wipes on **every restart and redeploy** — so the memory reset constantly. It now lives in **Neon Postgres**, so device history **persists across restarts, deploys, and cold starts**.

---

## Multi-device roadmap

The store is single-device today but already **fleet-shaped** via the `brand/model/device_id/customer_id` tags. To go multi-device/multi-customer:

- **Retrieval filtering:** add `search_kwargs={"filter": {...}}` to the retrievers to scope manuals by `model` and history by `device_id` (deferred until >1 device so it's testable).
- **Device-aware requests:** have `POST /chat` accept a `device_id` (+ model) per request/session and thread it through retrieval filters and backend calls.
- **Access control:** enforce the `customer_id` filter **server-side from the auth key** so a caller can't read another tenant's device history.
- **Backend (separate team):** `/api/retrieve-logs`, `/api/self-test-report`, `/api/last-service-date` will need a `device_id` param, and `/api/lookup-code` will need to be model/brand-aware.
- **Scale:** `device_history` grows unbounded with a fleet → move Neon from Free (0.5 GB) to a paid tier and add log retention/summarization.

---

## Troubleshooting

| Symptom | Likely cause / fix |
|---|---|
| Boot logs show `Processing PDFs` / `Created and populated new collection` | The app should **connect only**, not rebuild. Means a collection is empty → run `seed_pgvector.py`. |
| Error-code lookups return "temporary issue" / HTTP 429 | Chat→backend call is going over the **public** backend URL and hitting Cloudflare rate limits. Use the **internal** `http://ingenzi-backend:10000` and ensure the backend is on a paid instance. |
| Retrieval returns nothing | The Neon collections aren't seeded, or `DATABASE_URL` points at the wrong DB. Re-run the seed and verify counts. |
| Seed fails: `max_tokens_per_request` | OpenAI's 300k-token/request cap. The seeder already batches at 200 chunks; lower `chunk_size` further if needed. |
| App won't boot: Tavily / OpenAI / DB error at import | A required env var is missing (`TAVILY_API_KEY`, `OPENAI_API_KEY`, `DATABASE_URL`). |
| First API call very slow / times out | Free-instance cold start + agent tool calls. Use a ≥120s client timeout; consider upgrading the chat instance to remove spin-down. |
