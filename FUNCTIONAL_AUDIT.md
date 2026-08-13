# Functional Audit — AI Evidence Copilot Prototype

Audited by walking every interactive element with Playwright across Resolution Center →
Dispute Detail → AI Investigation → Evidence Review → Submission. Zero console errors
throughout the existing flow; the issues below are all missing/incomplete *behavior*, not
crashes.

## 1. Broken interactions

| Element | Expected | Actual |
|---|---|---|
| **Amount / Dispute date / Evidence due by filter pills** (Resolution Center) | Open a filter popover, like "Reason" does | No `onClick` handler at all — purely decorative |
| **"Add" button** (manual evidence checklist, pre-AI phase) | Open an add-evidence flow | No-op |
| **"Verify" button** (evidence review) | Mark item verified, let seller inspect what they're verifying first | Marks verified immediately — seller has no way to see the underlying record before confirming |
| **"Unverify"** | Should exist so verification is reversible | Does not exist — verification is one-way |
| **"Save draft"** (response card) | Some acknowledgment that the draft was saved | Silent no-op |

## 2. Missing states

- **No evidence source view of any kind.** The expandable panel shows the AI's one-line summary of a record ("Payment of $499.00 processed…") but never the record itself. The seller is asked to trust a paraphrase, not inspect a source — this is the core structural gap named in the brief.
- **No "View evidence" affordance** on any of the 8 evidence rows.
- **No evidence-source indicator** (e.g., "Source: Customer Analytics → Sarah Johnson → Activity") — the seller can't tell *where* a claim came from, only that the AI asserts it.
- **No add-evidence modal/panel** — clicking "Add" has nothing to open.
- **No "reset demo" affordance** — once submitted, the only way back to a fresh dispute is reloading the page (which the brief explicitly says the demo must not require).

## 3. Logical UX gaps

- **Verify-without-inspecting.** The single biggest gap: a seller can click "Verify" on all 8 items without ever seeing a source record. That inverts the product's own thesis ("AI does the tedious work → human verifies the evidence") — verification currently means nothing.
- **Submit gating message is static.** "Verify all evidence items above to enable submission" doesn't say *how many* remain or offer a way to jump back to the unverified ones.
- **Evidence and verified counts are correct today, but hard-coded to the static 8-item array** — they will not survive adding a 9th item, which section 8 of the brief requires.
- **The "Not found" (Download records) row correctly has no actions** — there's nothing to view or verify for evidence that doesn't exist. This is intentional, not a gap, and is left as-is.
- **Filter pills that don't open anything sit visually identical to "Reason," which does** — inconsistent affordance (a control that looks interactive but isn't).

## 4. Out of scope (documented, not fixed)

Consistent with "do not introduce unnecessary features" and "do not connect to real
systems": the sidebar nav icons (Home, Billing, Growth, Wallet), the topbar icon cluster
(+, gear, help, bell) and AI search bar, and the "Export" button remain inert decorative
chrome. They sit outside the dispute-evidence workflow this prototype demonstrates, and
wiring them up would mean inventing unrelated pages with no connection to the product
thesis. The list's "Search" input accepts text but doesn't filter — there is exactly one
mock dispute, so filtering has nothing to demonstrate.

## 5. Required fixes (this pass)

1. Give every evidence item a `sourceType` + `sourceLabel` and build five real source
   detail views (Transaction, Customer Activity, Product, Terms/Policy, Support
   Communication) containing the actual records the AI's claims are drawn from.
2. Add a "View evidence" action per row that navigates to the matching source view, with a
   back action that returns to the dispute at the same point.
3. Add a quiet per-row source indicator ("Source: …") so provenance is never a guess.
4. Rework the verify control into Verify ⇄ Unverify with correct alignment, live counts,
   and a status line ("AI found" → "AI found · Human verified").
5. Make the evidence array stateful (not a fixed-length import) so Add Evidence can append
   to it and every count stays derived, never hard-coded.
6. Build a real Add Evidence modal (type select + fields) whose output is verifiable and
   viewable exactly like AI-found evidence.
7. Make the Submit Response section reflect real state: remaining-count messaging and a
   "Review evidence" jump-back link while incomplete; a clear "All evidence reviewed" state
   once done.
8. Wire the three inert filter pills to open popovers, matching the Reason pattern.
9. Add a "Reset demo" action reachable from the submitted-confirmation screen.
10. Give "Save draft" a real (mocked) acknowledgment.
