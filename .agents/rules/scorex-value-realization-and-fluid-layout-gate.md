# ScoreX Value Realization, 100% Fluid Edge-to-Edge Layout, 10-Module Tabs, Question Form Ergonomics (`Rule 50G`), New-Assessment Isolation, Consulting Brand Ban & Synchronous 2-Project Cloud Run Deployment Gate (`Rule 50` & `Rule 56` / `L60-01`..`L60-13`)

Whenever modifying, generating, auditing, or deploying any component of **ScoreX** (`/Users/nitinagga/Documents/scorex`):

1. **100% Fluid Edge-to-Edge Layout (`Rule 50A` / `Rule 25G`)**:
   - Enforce `width: 100%; max-width: 100%; padding: ... clamp(16px, 1.8vw, 28px);` across every page (`GeValueRealizationWorkspace`, `HomePageNew`, `AssessmentStart`, `AssessmentsListNew`, `ExecutiveCommandCenter`, `ExecutiveSummaryNew`, `AssessmentDashboard`, `MyAssessments`, `FeedbackForm`, `UserGuide`, `AuthorAssignments`, `AssessmentHeader`, `AssessmentDetails`, `PitchDeck`, `AssessmentHistory`, `AssessmentResultsNew`, `GenAIReadiness*.css`) with `0` rigid `max-width: 1200px..1560px` desktop containers.

2. **10-Module Tab Bar (`#ge-module-tabs-bar`), 3-Column Question Input Grid (`Rule 50G`), 2x2 Intake Grid & Semantic 4-Column Runner (`Rule 50F`–`50G` / `L60-11`..`L60-13`)**:
   - Divide the 82 questions into `#ge-module-tabs-bar` (`C`·`P`·`A`·`W`·`T`·`Q`·`U`·`L`·`R`·`F`) with a 2-column card grid (`repeat(auto-fill, minmax(660px, 1fr))`), human-readable `formatInputTypeLabel(q.inputType)`, balanced 3-column input row (`2.15fr` Answer / `0.9fr` Tier A–E / `0.75fr` Score) + unified 1-line provenance/owner footer (`0` duplicate 4th column), `?tab=provenance|audit|report` sync, light Release Gate banner (`#fff1f2`/`#ecfdf5`), `showSavedHubDrawer = useState(false)`, `AssessmentsListNew.js` isolating `'blueprints'` vs `'dossiers'`, `AssessmentStart.js` 2×2 `IntakeFieldsGrid` (`0` `#ff6b35` orange, `groundingPreviewOpen = false`), `DynamicAssessmentRunner.js` semantic 4-column palette (Current `#2563eb`, Future `$variant="future"` `#059669`, Technical `#e11d48`, Business `$variant="business"` `#d97706`), and `DynamicAssessmentReport.js` 4-card Hero Strip + Tab 4 isolation.

3. **Strict Ban on Third-Party Consulting Brands & Sequential Card Ordering (`Rule 50B`..`50E` / `Rule 25F`, `25H`, `25I`, `25J`, `25L`)**:
   - Never inject `McKinsey & Google`, `McKinsey`, `BCG`, `Bain`, `Stratagem/Google`, `Deloitte`, `Quantiphi`, `Accenture`, `PwC`, `Slalom`, or `KPMG` across ScoreX or PromptCanvas; enforce ascending card order (`C01` $\rightarrow$ `C02` $\rightarrow$ `C03`); ban `window.prompt()`/`alert()`/`confirm()`; and isolate customer CRM records (`biopharma_global`, `pfizer`, `elevance`, `mars`, `heb`).

4. **Mandatory Synchronous 2-Project Cloud Run Deployment (`Rule 56`)**:
   - Always build images in `nitina-ggarwal-sandbox-647724` (`us-central1-docker.pkg.dev/nitina-ggarwal-sandbox-647724/cloud-run-source-deploy/scorex-app:<TAG>`) and update `scorex` in `ramp-portal-dev` (`us-west1`) synchronously within the active turn after `git push origin main`.
