"""
One-time seed for the Postgres/pgvector store used by chat_ultrasound_chroma.py.

Loads the reference manuals (and the initial device-history seed docs) from the
PDF folders in this directory into Neon/Postgres, tagged with the fleet-ready
metadata schema (brand / model / device_id / customer_id / doc_type / timestamp).

The chat app no longer builds vectorstores at boot — it just connects to the
collections this script creates.

Run once from the RAG/ directory, with DATABASE_URL and OPENAI_API_KEY set:

    # seed everything (resets each collection first)
    python seed_pgvector.py

    # later: refresh the reference manuals WITHOUT wiping accumulated device history
    python seed_pgvector.py --skip-history

IMPORTANT: the embedding model here must match the one the app uses
(OpenAIEmbeddings default), or stored vectors won't line up with query vectors.
"""

import argparse
import os
import sys
from datetime import datetime

from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader
from langchain_openai import OpenAIEmbeddings
from langchain_postgres import PGVector
from langchain_text_splitters import RecursiveCharacterTextSplitter
from tqdm import tqdm

load_dotenv()

# --- Identity tags (mirror the app defaults; override via env if needed) ---
DEVICE_BRAND = os.environ.get("DEVICE_BRAND", "Philips")
DEVICE_MODEL = os.environ.get("DEVICE_MODEL", "HDI-5000")
DEVICE_ID = os.environ.get("DEVICE_ID", "HDI5000-DEMO-001")
CUSTOMER_ID = os.environ.get("CUSTOMER_ID", "default")

# --- Connection (langchain_postgres needs the +psycopg driver prefix) ---
_raw_db_url = os.environ.get("DATABASE_URL", "")
if not _raw_db_url:
    sys.exit("ERROR: DATABASE_URL is not set. Set it to your Neon direct connection string.")
if _raw_db_url.startswith("postgresql://"):
    PG_CONNECTION = _raw_db_url.replace("postgresql://", "postgresql+psycopg://", 1)
elif _raw_db_url.startswith("postgres://"):
    PG_CONNECTION = _raw_db_url.replace("postgres://", "postgresql+psycopg://", 1)
else:
    PG_CONNECTION = _raw_db_url

if not os.environ.get("OPENAI_API_KEY"):
    sys.exit("ERROR: OPENAI_API_KEY is not set.")

# chunk_size = texts per embeddings request. OpenAI caps a single request at
# 300k tokens; the default (1000 texts) can exceed that for large chunks, so we
# send smaller batches. This only affects seeding throughput, not the vectors.
embeddings = OpenAIEmbeddings(
    openai_api_key=os.environ.get("OPENAI_API_KEY"),
    chunk_size=200,
)

# Reference collections: (collection_name, source_directory, doc_type)
REFERENCE_COLLECTIONS = [
    ("ultrasound_manuals", "Manuals", "manual"),
    ("error_manuals", "Errors", "error_code"),
    ("maintenance_manuals", "Maintenance_docs", "maintenance"),
]
# Device-history seed: (collection_name, source_directory, doc_type)
DEVICE_HISTORY = ("device_history", "device_history", "device_history_seed")


def load_and_split(directory):
    """Load every PDF in a directory and split into chunks."""
    if not os.path.isdir(directory):
        sys.exit(f"ERROR: directory not found: {directory}")
    pdf_files = [f for f in os.listdir(directory) if f.endswith(".pdf")]
    documents = []
    for filename in tqdm(pdf_files, desc=f"Loading {directory}"):
        documents.extend(PyPDFLoader(os.path.join(directory, filename)).load())
    return RecursiveCharacterTextSplitter().split_documents(documents)


def seed_collection(name, directory, doc_type, device_scoped):
    """(Re)build a collection from its source PDFs with fleet-ready metadata."""
    chunks = load_and_split(directory)
    for chunk in chunks:
        chunk.metadata["brand"] = DEVICE_BRAND
        chunk.metadata["model"] = DEVICE_MODEL
        chunk.metadata["doc_type"] = doc_type
        if device_scoped:
            # history docs are additionally scoped to a specific unit + tenant
            chunk.metadata["device_id"] = DEVICE_ID
            chunk.metadata["customer_id"] = CUSTOMER_ID
            chunk.metadata["timestamp"] = datetime.now().isoformat()

    PGVector.from_documents(
        documents=chunks,
        embedding=embeddings,
        collection_name=name,
        connection=PG_CONNECTION,
        use_jsonb=True,
        pre_delete_collection=True,  # idempotent: reset this collection before seeding
    )
    print(f"  seeded '{name}': {len(chunks)} chunks")


def main():
    parser = argparse.ArgumentParser(description="Seed the pgvector store.")
    parser.add_argument(
        "--skip-history",
        action="store_true",
        help="Only (re)seed the reference manuals; leave device_history untouched.",
    )
    args = parser.parse_args()

    print("Seeding reference collections...")
    for name, directory, doc_type in REFERENCE_COLLECTIONS:
        seed_collection(name, directory, doc_type, device_scoped=False)

    if args.skip_history:
        print("Skipping device_history (left intact).")
    else:
        print("Seeding device_history...")
        name, directory, doc_type = DEVICE_HISTORY
        seed_collection(name, directory, doc_type, device_scoped=True)

    print("Done.")


if __name__ == "__main__":
    main()
