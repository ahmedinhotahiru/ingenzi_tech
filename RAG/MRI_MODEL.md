# MRI / MedGemma Model Service

The RAG assistant ("Tony") answers ultrasound questions from its own knowledge base, but **MRI-specific medical questions are routed to a separate fine-tuned MedGemma model** running on a GPU. This document covers that model service: what it is, where and how it's deployed, why the platform was chosen, and how to (re)deploy it.

> ### 🔒 Security note (this repo is public)
> The Modal endpoint URL and its auth token are **secrets** and are kept out of this repo (placeholders `<mri-endpoint-url>` / `<token>` are used here). They live in the team's private ops notes, Modal secrets, and the chat service's environment variables. Public model IDs are fine to name (they're already public on Hugging Face).

---

## What it is

- **Base model:** [`google/medgemma-4b-it`](https://huggingface.co/google/medgemma-4b-it) — Google's MedGemma 4B instruction-tuned medical model (image-text-to-text). It is a **gated** model on Hugging Face, so a HF token that has accepted the license is required to pull the weights.
- **LoRA adapter:** `BernesLy/medgemma-4b-it-sft-lora-crc100k` — a supervised fine-tune, applied on top of the base and **merged** into it at load time (`merge_and_unload()`).
- **Role in the system:** the RAG agent's `query_mri_model` tool sends MRI/medical questions to this model's HTTP endpoint and returns the answer. All ultrasound/manual/error/maintenance questions stay in the main RAG pipeline — only MRI-specific queries go here.

---

## Where & how it's deployed

**Platform: [Modal](https://modal.com)** — serverless GPU. Defined in [modal_medgemma.py](modal_medgemma.py).

| Aspect | Value |
|---|---|
| Modal app name | `medgemma-mri` |
| GPU | `A10G` |
| Python image | `debian_slim` (3.11) + torch, transformers, accelerate, peft, huggingface_hub, fastapi, pydantic, pillow |
| Weights | **Baked into the image** at build time (`snapshot_download` of the base + adapter) so cold starts don't re-download |
| Scale-to-zero | `scaledown_window=300` (spins down after 5 min idle) |
| Request timeout | `600s` |
| Endpoint | `@modal.fastapi_endpoint(method="POST")` on the `MedGemma` class |
| Auth | `Authorization: Bearer <token>` — checked against `MRI_ENDPOINT_TOKEN` |
| Modal secrets used | `huggingface` (HF token, for gated weights) and `mri-endpoint-auth` (the bearer token) |

The `MedGemma` class loads the base model + adapter once in `@modal.enter()` (per container), then serves inference from the merged model.

### API contract
```
POST <mri-endpoint-url>
Authorization: Bearer <token>
Content-Type: application/json

{ "question": "…", "max_new_tokens": 512 }   # max_new_tokens optional (default 512)
        ▼
{ "answer": "…" }
```
Returns `401` if the bearer token is missing/wrong.

---

## Why Modal (and not HF Spaces / ZeroGPU)

The model originally ran on **Hugging Face Spaces with ZeroGPU** (see [`../hf_space/app.py`](../hf_space/app.py) — a Gradio app using `@spaces.GPU`). It was migrated to Modal. The technical case for Modal as the model backend:

- **Purpose-built as a callable API.** HF Spaces/ZeroGPU is designed for interactive Gradio demos, not as a reliable programmatic backend. Modal gives a proper authenticated HTTP endpoint the agent can call.
- **Dedicated GPU, no shared queue.** ZeroGPU shares GPU time across the platform with quotas/queueing; Modal provisions a dedicated A10G per request lifecycle.
- **Auth built in.** The Modal endpoint enforces a bearer token; the Spaces demo was effectively open.
- **Scale-to-zero economics.** `scaledown_window=300` means you only pay for GPU while it's actually serving (plus a short idle tail), then it spins down — good for an intermittently-used tool.
- **Reproducible image + baked weights.** The environment and model weights are pinned into the Modal image, so deploys are deterministic and cold starts skip re-downloading.

> ℹ️ The "why" above is the evident technical rationale from the code and migration. If the team had additional/other reasons (cost, quota limits hit, reliability incidents), add them here.

---

## Deploying / redeploying

Prerequisites: a Modal account + CLI (`pip install modal`, `modal token new`), and a Hugging Face token that has accepted the `google/medgemma-4b-it` license.

1. **Create the Modal secrets** (once):
   ```bash
   # HF token (name must be "huggingface"; key HF_TOKEN)
   modal secret create huggingface HF_TOKEN=<your-hf-token>

   # Endpoint bearer token (name "mri-endpoint-auth"; key MRI_ENDPOINT_TOKEN)
   modal secret create mri-endpoint-auth MRI_ENDPOINT_TOKEN=<generate-a-random-token>
   ```
2. **Deploy:**
   ```bash
   modal deploy modal_medgemma.py
   ```
   Modal builds the image (downloading and baking in the weights) and prints the endpoint URL for the `infer` method.
3. **Note the endpoint URL** it prints — that's `<mri-endpoint-url>`.

---

## Wiring it into the chat

The RAG chat service reads two env vars (see [Environment variables](README.md#environment-variables) in the main README):

| Chat env var | Set to |
|---|---|
| `MRI_MODAL_ENDPOINT` | the Modal endpoint URL from deploy (`<mri-endpoint-url>`) |
| `MRI_MODAL_TOKEN` | **the same value** as the Modal secret `MRI_ENDPOINT_TOKEN` |

⚠️ **Name mismatch to remember:** the chat side calls its token `MRI_MODAL_TOKEN`, while the Modal side calls it `MRI_ENDPOINT_TOKEN`. They must hold the **same** value or every call gets a `401`. If `query_mri_model` returns "MRI model service is not configured," one of these env vars is missing on the chat service.

---

## The predecessor (`../hf_space/`)

`../hf_space/app.py` is the earlier HF Spaces (ZeroGPU) Gradio deployment of the same base model + adapter. It is **superseded by the Modal deployment** and kept for reference. If you ever need a quick interactive demo (vs. an API), that's what it provides.

---

## Notes & gotchas

- **Cold starts.** With scale-to-zero, the first request after idle spins up a container and loads a ~4B model onto the GPU — expect a slow first response (tens of seconds), then fast while warm. The chat tool uses a 120s timeout to accommodate this.
- **GPU cost.** A10G time is billed while serving; scale-to-zero keeps idle cost near zero, but sustained traffic incurs real GPU cost.
- **Gated base model.** If the HF token loses access (or the license isn't accepted), the image build fails to download `google/medgemma-4b-it`.
- **Adapter provenance.** The LoRA adapter (`…crc100k`) is a third-party fine-tune; validate it still fits the intended MRI/medical use if you change models.
