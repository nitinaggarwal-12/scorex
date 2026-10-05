# ScoreX Database Synchronization & Deterministic Seed Store (`v3.7.0`)

This directory manages the deterministic seed dataset (`export-data.json`) and PostgreSQL synchronization utility (`sync-to-railway.js`) for ScoreX across **Google Cloud Run** (`ramp-portal-dev` / `us-west1` at `https://scorex-248990048888.cr.gclb.goog`, and `nitinagga-ge-2` / `us-central1` at `https://scorex-638420508320.us-central1.run.app`) and **PostgreSQL (`scorex_postgres`)**.

## Files

- `export-data.json` — Clean, deterministic seed store containing the **4 Fictitious Enterprise Benchmark Personas** (`ConnectPlus Telecom`, `Apex Financial Partners`, `Helios Retail Group`, `NovaBio Health Systems`) with zero duplicate entries and zero real customer names.
- `sync-to-railway.js` — Idempotent synchronization script (`ON CONFLICT DO NOTHING`) for PostgreSQL deployments (`scorex_postgres`).

## How to Run

```bash
export RAILWAY_DATABASE_URL="postgresql://postgres:PASSWORD@HOST:PORT/scorex_postgres"
node db-sync/sync-to-railway.js
```

## Governance Invariants (`v3.7.0`)

- Strictly 1 canonical legacy assessment record per fictitious enterprise benchmark persona (`4` seeded benchmark records in `export-data.json`), paired with:
  - **Engine 1 (`data/dynamic_assessments.json`)**: `6` complete dynamic assessment demo instances (`inst_enterprise_data_ai_maturity_demo`, `inst_openai_to_gemini_enterprise_migration_demo`, `inst_finops_cloud_cost_optimization_demo`, `inst_agentic_ai_mesh_mcp_banking_readiness_demo`, `inst_edw_lakehouse_to_bigquery_modernization_demo`, `inst_enterprise_ai_zero_trust_security_demo`).
  - **Engine 2 (`server/services/geCustomerMultiSourceIngestor.js`)**: `2` multi-source Gemini Enterprise Value Realization dossiers (`ACC-1001-AEROVG` AeroVanguard Defense Systems & `ACC-1002-BIONOVA` BioNova Therapeutics) across 82 questions, 10 modules, and 8 enterprise evidence sources.
  - **Engine 3 (`client/src/data/euAiComplianceData.js`)**: `EUAIA-2026-HR4902` (`TalentPulse HR Screening & Candidate Ranking AI`) across 20 statutory EU AI Act questions.
- Zero confidential or real customer names in any git-tracked seed file, and zero deprecated cloud database environment strings.
- Full compatibility with the **3 Canonical Assessment Engines** and **5-Tier Google / Gemini / DeepMind Model Stack** (`google-omni-1.1`, `gemini-omni-1.1-flash`, `gemini-3.1-pro-preview`, `gemini-3.8-flash`, `gemini-3.1-flash-live-preview`, `veo-3.1-generate-preview`, `lyria-3.5`, `gemini-3.1-flash-tts-preview`, `gemini-3.1-flash-image-preview`, `gemini-embedding-001`, `text-embedding-005`).
