# Commas AI Evidence Copilot

An interview prototype: an AI-assisted evidence collection and verification workflow for
Commas' Resolution Center, built to demonstrate the product concept in
[`Commas_AI_Evidence_Copilot_Product_Proposal.docx`](./Commas_AI_Evidence_Copilot_Product_Proposal.docx).

The AI investigates a dispute, collects evidence, and drafts a response — but a human always
inspects the source, verifies each item, and submits. Nothing here touches a real payment or
dispute system; all data is deterministic mock data.

## What's here

- **Resolution Center → Dispute → AI Copilot** flow, reproducing Commas' existing visual
  language (see [`DESIGN.md`](./DESIGN.md) for the reverse-engineered design system).
- **AI investigation**: a simulated multi-step evidence-collection pass with a live progress
  checklist, case summary, customer journey, and draft response.
- **Evidence verification**: every AI-found item links to a real mock source record
  (transaction, customer activity, product listing, terms/policy, support thread) so a
  seller can inspect before verifying — never asked to trust a claim blind.
- **Manual evidence**: sellers can add their own evidence, which is verifiable and traceable
  the same way as AI-found items.
- Full reset, so the demo can be run start to finish repeatedly without reloading.

## Stack

React + TypeScript + Vite + Tailwind CSS v4, with Playwright for end-to-end/visual testing.

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
```

## Testing

```bash
npm run test:e2e  # Playwright: full flow, dispute → evidence → verify → submit → reset
```

## Docs

| File | Purpose |
|---|---|
| [`PROTOTYPE_SPEC.md`](./PROTOTYPE_SPEC.md) | Extracted spec: workflow, AI/human responsibilities, required UI states |
| [`DESIGN.md`](./DESIGN.md) | Reverse-engineered Commas design system (typography, color, components) |
| [`FUNCTIONAL_AUDIT.md`](./FUNCTIONAL_AUDIT.md) | Audit of every interactive element and the fixes applied |
