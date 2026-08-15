# UI kit & navigation architecture

## Grouped Navigation & Assessment Architecture

All assessments in the suite are organized into four logical categories:
- **Discovery**: Use Case Discovery Intake & Rapid Qualification
- **Maturity & Readiness**: Flagship V12 Enterprise Readiness Assessor & MLOps Maturity
- **Financial & Portfolio**: Scoped Feasibility & Financial ROI Payback
- **Technical & Consultative Scoping**: Architecture Blueprint Canvas & Scoping Wizards

Each assessment routes through a tailored introduction page (`AssessmentLanding.jsx`) explaining what it is, why it exists, and how it differs from other assessments in the suite before launching the tool.

## Canonical Flagship Assessor: `option12` (`PremiumScopingAssessorV12.jsx`)

`PremiumScopingAssessorV12.jsx` is the active, full-featured 25-pillar enterprise scoping and readiness engine with real-time Vertex AI synthesis, radar plotting, and GxP compliance scoring.

## Grouping & Per-Assessment Metadata

`src/data/assessmentCatalog.js` is the single source of truth for:
- Grouping definitions and icons
- Visual intro template selection (`story` / `blueprint` / `dossier` / `editorial` / `canvas`)
- Assessment names, subtitles, badges, and consultative guidance copy

## Shared UI Kit (`Button.jsx`, `Card.jsx`, `SectionHeader.jsx`)

These primitives standardize custom properties defined in `src/index.css` (`--google-blue`, `--bg-card`, `--border-color`, etc.) across navigation, sidebar, and landing layouts.
