# ScoreX (`v3.5.0`) — Deployment & Architecture Status

## Current Status: ✅ Production Ready & Certified (`v3.5.0`)

### 🏛️ 3-Engine Consolidated Architecture & 8-Blindspot Remediation
- **Engine 1 — Dynamic Assessment Blueprints Engine**: Active on `/assessments`, `/assessments/generator`, `/assessments/run/:typeKey`, `/assessments/run/instance/:instanceId`, and `/assessments/report/:instanceId` (6 production blueprints + 6 complete `inst_*_demo` executive dossiers + AI custom blueprint synthesis).
- **Engine 2 — GE Value Realization Engine**: Active on `/ge-value-realization` (and `/value-realization` redirect), `/roi-calculator`, and `/tco-calculator` (5-Column CFO Value Realization Bridge, 3-Horizon Roadmap, 15 workflows with full titles, and 5 KPA scorecards).
- **Engine 3 — EU AI Act Statutory Compliance Engine**: Active on `/eu-ai-act` and `/eu-ai-act/system/:id` (Statutory Risk Pyramid & Annex IV Conformity Dossier Generator).
- **4-Category Conversational Non-Mutation Guard**: Active on `POST /api/dynamic-assessments/generate-framework`, `POST /api/dynamic-assessments/instances/:id/generate-diagrams`, `POST /api/chat/message`, and `POST /api/eu-ai-act/systems/:id/copilot`.
- **Parameter-Preserving Legacy Route Consolidation**: `<LegacyReportRedirect />` and `<LegacyRunnerRedirect />` preserve `:id` parameters across `/results/:id`, `/executive/:id`, `/assessment-details/:id`, `/deep-dive/:id`, and `/assessment/:id/:pillar`.
- **Deep Forensic Blindspot Remediation & Legacy Purge**:
  - Restored `GET /api/dynamic-assessments/customer/:customerName` and `GET /api/dynamic-assessments/portfolio-rollup` with token-overlap fuzzy matching (`matchesCustomerFuzzy`).
  - Enabled `demo` session access to starter instances (`inst_*`, `ge_vr_*`, `EUAIA-*`) across `/api/chat/message` and `/api/excel/export/:id`.
  - Purged 18 unreferenced legacy Databricks/OpenAI services, dead routes (`genaiReadiness`), stale `.backup` files, and updated `dataStore.js` to atomic `.tmp` rename writes.
  - Enforced Universal Single-Source Trinity (`AGENTS.md` Rule 49) across all 7 governance pillars (`0` offenders) and upgraded all remaining `Gemini 1.5/2.0/2.5` model strings to `Gemini 3.1 Pro` / `Gemini 3.8 Flash`.

### 🧠 5-Tier Google / Gemini / DeepMind Model Stack
- **Tier 1 (Orchestrator & Forensic Judge)**: `Google Omni 1.1` (`google-omni-1.1` / `gemini-omni-1.1-flash`)
- **Tier 2 (Deep Reasoning, CFO Value & Vision)**: `Gemini 3.1 Pro` (`gemini-3.1-pro-preview`)
- **Tier 3 (Fast Classifier & Blueprint Compiler)**: `Gemini 3.8 Flash` (`gemini-3.8-flash`)
- **Tier 4 (Real-Time Interactive Streaming)**: `Gemini Flash Live` (`gemini-3.1-flash-live-preview`)
- **Tier 5 (Multimodal Media & Embeddings)**: `Veo 3.1` (`veo-3.1-generate-preview`), `Lyria 3.5` (`lyria-3.5` / `models/lyria-3-pro-preview`), `Neural Audio` (`gemini-3.1-flash-tts-preview`), `Imagen 3` (`gemini-3.1-flash-image-preview` / `models/imagen-3.0-generate-002`), `Gemini Embedding 001` (`gemini-embedding-001` / `text-embedding-005`)

### 🌐 Endpoints
- **Primary Argolis Google Cloud Run Deployment (`nitinagga-ge-2` / `admin@nitinagga.altostrat.com`)**:
  - `https://scorex-638420508320.us-central1.run.app` (`scorex` revision `scorex-00010-svh`, `ingress: all`, publicly accessible)
  - `https://scorex-blk2as46eq-uc.a.run.app` (`scorex` canonical alias)
  - `https://scorex-app-638420508320.us-central1.run.app` (`scorex-app` revision `scorex-app-00001-zw8`, `ingress: all`, publicly accessible)
- **Secondary Production URL (Railway)**: `https://scorex.up.railway.app/`
- **Local Runtime**: `http://localhost:5001`
- **API Health Check**: `https://scorex-638420508320.us-central1.run.app/api/health`



