# ScoreX (`v3.7.0`) — Deployment & Architecture Status

## Current Status: ✅ Production Ready & Certified (`v3.7.0` — 20-Level Forensic Audit & Governance Lockstep Remediated)

### 🏛️ 3-Engine Consolidated Architecture & 20-Level Forensic Remediation
- **Engine 1 — Dynamic Assessment Blueprints Engine**: Active on `/assessments`, `/assessments/hub`, `/assessments/ai-generator`, `/assessments/run/:typeKey`, `/assessments/run/instance/:id`, and `/assessments/report/:id` across all **6 canonical blueprints**:
  1. `enterprise_data_ai_maturity` (`inst_enterprise_data_ai_maturity_demo` — `ConnectPlus Telecom Global`)
  2. `openai_to_gemini_enterprise_migration` (`inst_openai_to_gemini_enterprise_migration_demo` — `Quantum FinTech Global`)
  3. `finops_cloud_cost_optimization` (`inst_finops_cloud_cost_optimization_demo` — `Nova Retail & E-Commerce Group`)
  4. `agentic_ai_mesh_mcp_banking_readiness` (`inst_agentic_ai_mesh_mcp_banking_readiness_demo` — `Apex Global Banking & Wealth`)
  5. `edw_lakehouse_to_bigquery_modernization` (`inst_edw_lakehouse_to_bigquery_modernization_demo` — `Global Logistics Alliance`)
  6. `enterprise_ai_zero_trust_security` (`inst_enterprise_ai_zero_trust_security_demo` — `CyberShield Health & Life Sciences`)
- **Engine 2 — Gemini Enterprise Value Realization Engine**: Active on `/ge-value-realization` and `/ge-value-realization/:dossierId` (plus `/value-realization`, `/roi-calculator`, `/tco-calculator` redirects) — 82 Questions across 10 Modules (`A`–`J`), 8 Enterprise Evidence Sources, 5-Column CFO Value Realization Ledger, Universal Hover Object Editor (`v1.0` Master Template + `v2.0+` Instance Versioning), and pre-seeded dossiers for **AeroVanguard (`ACC-1001-AEROVG`)** and **BioNova (`ACC-1002-BIONOVA`)**.
- **Engine 3 — EU AI Act Statutory Compliance Engine**: Active on `/eu-ai-compliance`, `/eu-ai-compliance/:id`, `/eu-ai-act/:id`, and `/eu-ai-act/system/:id` — 20 Statutory Questions across Regulation (EU) 2024/1689 (Art. 5, Art. 6 & Annex III, Arts. 9–15, Art. 50, Arts. 51–55 GPAI, Annex IV Technical File) with per-dossier synthesis storage scoping and pre-seeded `EUAIA-2026-HR4902` (`TalentPulse HR Screening & Candidate Ranking AI`) dossier.
- **4-Category Conversational Non-Mutation Guard**: Active on `POST /api/dynamic-assessments/generate-framework`, `POST /api/dynamic-assessments/instances/:id/generate-diagrams`, `POST /api/chat/message`, and `POST /api/eu-ai-compliance/copilot-chat`.
- **Parameter-Preserving Legacy Route Consolidation**: `<LegacyReportRedirect />`, `<LegacyRunnerRedirect />`, and `<LegacyCompareRedirect />` preserve `:assessmentId` and `:id` parameters across `/results/:assessmentId`, `/executive/:assessmentId`, `/assessment-details/:assessmentId`, `/deep-dive/:assessmentId`, `/assessment/:assessmentId/:categoryId`, `/genai-readiness/edit/:id`, and `/history/:assessmentId`.
- **Template 05 3-Zone Diagram Semantic, Logical & Visual Integrity Gate**: Certified across all 6 canonical blueprints × 3 stages (`18/18` diagrams) with `0` `..` truncations, `0` intra-word hyphen splits, `6/6` unique pain badges per assessment, 100% bijective `L1 CHANNELS`..`L6 ZERO-TRUST` bridge alignment, 100% domain-differentiated To-Be cylinders/hexagons/enablers/outcomes, and byte-synced server/client compilers.

### 🧠 5-Tier Google / Gemini / DeepMind Model Stack
- **Tier 1 (Orchestrator & Forensic Judge)**: `Google Omni 1.1` (`google-omni-1.1` / `gemini-omni-1.1-flash`)
- **Tier 2 (Deep Reasoning, CFO Value & Vision)**: `Gemini 3.1 Pro` (`gemini-3.1-pro-preview`)
- **Tier 3 (Fast Classifier & Blueprint Compiler)**: `Gemini 3.8 Flash` (`gemini-3.8-flash`)
- **Tier 4 (Real-Time Interactive Streaming)**: `Gemini Flash Live` (`gemini-3.8-flash-live-preview` / `gemini-3.1-flash-live-preview`)
- **Tier 5 (Multimodal Media & Embeddings)**: `Veo 3.1` (`veo-3.1-generate-preview`), `Lyria 3.5` (`lyria-3.5` / `models/lyria-3-pro-preview`), `Neural Audio` (`gemini-3.1-flash-tts-preview`), `Nano Banana 2 / Imagen 3` (`gemini-3.1-flash-image-preview` / `models/imagen-3.0-generate-002`), `Gemini Embedding 001` (`gemini-embedding-001` / `text-embedding-005`)

### 🌐 Endpoints
- **Canonical Verified BeyondCorp URL (`ramp-portal-dev` / `248990048888`, `us-west1`)**:
  - `https://scorex-248990048888.cr.gclb.goog` (Active revision: `scorex-00011-f7w`, `scorex-app` revision: `scorex-app-00011-wdx`, Baseline revision: `scorex-00002-2v7`)
- **Argolis Google Cloud Run Endpoints (`nitinagga-ge-2` / `638420508320` & `nitina-ggarwal-sandbox-647724` / `887605034827`, `us-central1`)**:
  - `https://scorex-638420508320.us-central1.run.app`
  - `https://scorex-blk2as46eq-uc.a.run.app`
  - `https://scorex-app-638420508320.us-central1.run.app`
  - `https://scorex-app-887605034827.us-central1.run.app` (Active revision: `scorex-app-00014-cwp`)
- **Local Runtime**: `http://localhost:5001`
- **API Health Check**: `/api/health`
