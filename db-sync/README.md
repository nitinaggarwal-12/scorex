# ScoreX Database Synchronization & Deterministic Seed Store (`v3.5.0`)

This directory manages the deterministic seed dataset (`export-data.json`) and PostgreSQL synchronization utility (`sync-to-railway.js`) for ScoreX across **Google Cloud Run (Argolis)** and **Railway**.

## Files

- `export-data.json` — Clean, deterministic seed store containing the **4 Fictitious Enterprise Benchmark Personas** (`ConnectPlus Telecom`, `Apex Financial Partners`, `Helios Retail Group`, `NovaBio Health Systems`) with zero duplicate entries and zero real customer names.
- `sync-to-railway.js` — Idempotent synchronization script (`ON CONFLICT DO NOTHING`) for PostgreSQL deployments (`scorex_postgres`).

## How to Run

```bash
export RAILWAY_DATABASE_URL="postgresql://postgres:PASSWORD@HOST:PORT/scorex_postgres"
node db-sync/sync-to-railway.js
```

## Governance Invariants (`v3.5.0`)

- Strictly 1 canonical legacy assessment record per fictitious enterprise benchmark persona (`4` seeded benchmark records in `export-data.json`), paired with the `6` complete dynamic assessment demo instances (`inst_*_demo`) in `data/dynamic_assessments.json`.
- Zero confidential or real customer names in any git-tracked seed file, and zero legacy `LAKEBASE_*` or `e2-demo-field-eng` strings.
- Full compatibility with the **3 Canonical Assessment Engines** and **5-Tier Google / Gemini / DeepMind Model Stack** (`google-omni-1.1`, `gemini-omni-1.1-flash`, `gemini-3.1-pro-preview`, `gemini-3.8-flash`, `gemini-3.1-flash-live-preview`, `veo-3.1-generate-preview`, `lyria-3.5`, `gemini-3.1-flash-tts-preview`, `gemini-3.1-flash-image-preview`, `gemini-embedding-001`, `text-embedding-005`).
