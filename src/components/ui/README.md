# UI kit & navigation history

## Two passes, worth understanding in order

**Pass 1 (consolidation):** the sidebar used to list eight parallel
"Assessment Modules" (v5 through v12), each a near-complete duplicate
implementation of the same core workflow. That read as internal
iteration history, not a product menu, so that pass collapsed the
sidebar down to one canonical entry (`option12`) and archived the rest
(unlinked, not deleted).

**Pass 2 (this one -- grouped navigation):** reverses that in favor of
organizing *all* of the assessments well, instead of hiding most of
them. Each one is a genuinely different tool for a different moment in
an engagement (see `src/data/assessmentCatalog.js`), not just a
version bump of the same tool -- so the right fix was better
information architecture, not fewer options. All assessments are
grouped into four logical categories (Discovery / Maturity & Readiness
/ Financial & Portfolio / Technical & Consultative Scoping) and each
has its own introduction page (`AssessmentLanding.jsx`) explaining
what it is, why it exists, and specifically how it differs from every
other assessment in the suite -- so the differentiation problem that
motivated Pass 1 is solved by making the differences legible instead
of by hiding the options.

The `option12` canonical-version research from Pass 1 is still useful
context below (it's still the flagship / most current tool in the
Maturity & Readiness group), just no longer the only thing linked.

## Canonical version: `option12` (`PremiumScopingAssessorV12.jsx`)

Chosen by looking at actual commit activity, not by guessing:

- The 7 most recent commits in the whole repository (as of this pass)
  all touch `PremiumScopingAssessorV12.jsx`.
- `PremiumScopingAssessorV10.jsx` has more total commits (52) but
  development stopped on 2026-06-12 -- it was superseded by V11, then V12.
- V5-V9 and V11 stopped changing earlier still.

A full line-by-line merge of V10 and V12 was considered and rejected for
this pass: both files are ~4,000+ lines, they've diverged structurally,
and there's no way to verify a merged result behaves correctly without
running the app in a browser. Picking the actively-maintained version is
the safer move. If V10 turns out to have a specific feature worth
keeping, port that one feature into V12 deliberately, rather than
merging wholesale.

## Still genuinely unused

`EnterpriseReadinessV10.jsx` is confirmed dead code (never imported by
`App.jsx`, in either pass) -- unlike everything else, this one isn't a
matter of navigation choice, it's just not wired up. Worth deleting
once you've confirmed nothing in it needs to be ported anywhere.

## Grouping & per-assessment styling

`src/data/assessmentCatalog.js` is the single source of truth for:
which group an assessment belongs to, which of the 5 visual templates
its introduction page uses (`story` / `blueprint` / `dossier` /
`editorial` / `canvas` -- see `AssessmentLanding.jsx`), and the actual
what/why/where/how/value/differentiator copy. Add a new assessment by
adding one entry there, not by hardcoding copy in a component.

`option10` (Portfolio Intelligence) is the one exception: it already
has its own full bespoke landing page (`PremiumLandingPageV10.jsx`,
~3,000 lines) that serves the same "introduction" purpose, so it's
represented in the catalog for grouping/display on the home page but
routes through its existing landing rather than through the generic
`AssessmentLanding` template.

**A note on the copy itself:** a few of the original per-assessment
descriptions (in the pre-existing content map this replaced) asserted
specific compliance guarantees as settled fact -- e.g. claiming the
tool itself provides "FDA 21 CFR Part 11 lineage logging." Rewritten to
say the assessment *audits for* or *supports* those things instead.
Worth a compliance/legal read-through before this goes in front of a
real regulated-industry customer -- I softened the most obviously
overclaimed lines but did not do a full legal review.

## Shared UI kit (`Button.jsx`, `Card.jsx`, `SectionHeader.jsx`, `ScoreBadge.jsx`)

These are new primitives, built on the CSS custom properties already
defined in `src/index.css` (`--google-blue`, `--bg-card`,
`--border-color`, etc.) which were previously used inconsistently
alongside ~5,600 inline `style={{...}}` blocks.

**Rollout status:** applied to `Sidebar.jsx` and `Navbar.jsx` (the
persistent chrome every screen shares) in this pass. The large assessor
screens (`PremiumScopingAssessorV12.jsx`, `ReportView.jsx`,
`IntakeForm.jsx`, etc.) still use inline styles and have **not** been
migrated — that's a much bigger, screen-by-screen job that should happen
incrementally, verified in-browser each time, rather than as one sweeping
change. Use the new primitives for any new UI; migrate old inline-styled
sections opportunistically when you're already touching that code.
