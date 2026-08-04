# UI kit & navigation consolidation

## What changed and why

The sidebar used to list eight parallel "Assessment Modules" (v5 through
v12), each a near-complete duplicate implementation of the same core
workflow (intake questions -> scoring -> report). That's an internal
iteration history, not a product menu, and it was being shown directly
to customer-facing users. This pass consolidates the *user-facing*
navigation down to one workflow.

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

## Archived (not deleted)

`option2` (InteractiveDiscoveryFramework), `option3`
(FdeEngagementModelV3), `option4` (ArchitectureCanvas), `option5`/`option6`
(MaturityAssessor), `option7` (AgenticDiscoveryV7), `option8`
(UnifiedScopingAssessor), `option9` (PremiumScopingAssessorV9), `option11`
(PremiumScopingAssessorV11), and `EnterpriseReadinessV10.jsx` (which
turned out not to be wired into the router at all) are still in the
codebase and their routes still work if you know the hash URL. They are
**not** linked from `Sidebar.jsx` — see the routing comment in `App.jsx`
above the view switch.

This is "internal-only" in the sense of "not discoverable in the UI,"
not auth-gated. True access control would need a backend check; that's
a separate, larger piece of work if it's actually needed (e.g. if these
routes contain anything customer-sensitive that shouldn't be reachable
even by URL guessing).

**Suggested next step:** once you've confirmed nothing in V9/V10/V11 is
needed, delete the files outright rather than leaving them as unreachable
dead code — they account for roughly 20,000 of the ~45,000 lines in
`src/components/`.

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
