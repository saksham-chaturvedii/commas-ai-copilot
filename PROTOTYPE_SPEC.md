# PROTOTYPE_SPEC — Commas AI Evidence Copilot

Source: `Commas_AI_Evidence_Copilot_Product_Proposal.docx` (August 2026).
Scope: only what is needed to implement and demo the interview prototype. Not a product redesign.

## Core Idea

Turn Commas' existing dispute-evidence checklist into a one-click AI investigation inside Resolution Center. The AI assembles the strongest available evidence, explains why each item matters, and drafts a recommended response. The seller — not the AI — verifies the evidence and submits the case.

Operating model: **AI does the tedious investigation → human verifies the evidence → human submits the response.**

## 1. User Problem

- A seller has a limited window (11 days in the demo scenario) to respond to a chargeback and must prove the customer received what they paid for.
- The pain is not missing information — it is the time and cognitive effort of manually reconstructing the customer journey between purchase and dispute.
- Evidence today is manually assembled from: transaction/payment details, purchase timestamp and checkout info, customer identity/account info, IP and device info, login and account activity, course/community/webinar access records, content viewed/sessions/downloads, product description and offer at time of purchase, invoices/terms/refund policy, customer communications and support history, prior successful transactions.
- Especially painful for coaching businesses: fulfillment is distributed across the platform's course/community experience and connected systems.

## 2. Proposed Workflow

The dispute workflow has 8 steps. The AI compresses steps 1–6 into one assisted investigation; steps 7–8 stay human-controlled:

1. Understand the dispute reason and what must be proven. *(AI)*
2. Find the relevant transaction and customer. *(AI)*
3. Collect the evidence relevant to that dispute type. *(AI)*
4. Cross-check evidence across the customer journey. *(AI)*
5. Explain what each piece of evidence proves. *(AI)*
6. Draft a coherent response using only verified facts. *(AI)*
7. Seller reviews the evidence and response. *(Human)*
8. Submit the final response. *(Human)*

Entry point: seller opens a dispute in Resolution Center and clicks **"Collect evidence with AI"** (this exact label — not "Analyse using AI" or "Verify via AI").

## 3. AI Responsibilities

The AI behaves like an **evidence investigator, not an autonomous decision-maker**. It gathers facts, connects them, identifies gaps, and drafts a response without inventing evidence.

Investigation flow:
1. Read the dispute reason and disputed amount.
2. Retrieve the associated transaction and checkout details.
3. Identify the product, offer, subscription, or service involved.
4. Retrieve the customer record and relevant historical transactions.
5. Collect available access, login, usage, fulfillment, or activity evidence.
6. Retrieve relevant product descriptions, terms, and refund policies.
7. Retrieve connected customer communications when available.
8. Rank evidence by relevance and confidence.
9. Generate a customer-journey timeline.
10. Draft a recommended response grounded only in collected evidence.
11. Flag missing or contradictory evidence for human review.

Dispute-specific evidence strategies:

| Dispute reason | Evidence to prioritize |
|---|---|
| Product not received | Purchase → access granted → login → content viewed → downloads → fulfillment/activity |
| Not as described | Product description at purchase → actual product delivered → course/community contents → communications → usage |
| Fraudulent transaction | IP → device → account history → login activity → previous successful transactions → geographic consistency |

Every evidence item includes a **"Why it matters"** explanation. Example format:

> **Login activity: August 3, 10:32 AM**
> Customer logged into the purchased program 18 hours after purchase.
> **Why it matters:** This supports that the customer was granted access and accessed the purchased service.

## 4. Human Responsibilities

- The seller verifies each piece of AI-found evidence and remains accountable for the final case.
- The seller submits the response; the AI never submits automatically or silently.
- The UI must explicitly distinguish **AI status** (Found) from **Human status** (Verified / Needs review).
- The **Submit Response action is disabled until required evidence has been reviewed**.
- The system preserves an audit trail: what the AI found, what the seller verified, what response was submitted, which evidence was included.

## 5. Required UI States

The feature lives **inside the existing Resolution Center** — not a separate AI destination.

### a) Entry point (dispute detail)
```
Dispute #1234
Reason: Product not received
Amount: $499
Response due: Aug 18
[ Collect evidence with AI ]
```

### b) Investigation progress
Checklist that fills in as evidence is collected:
```
AI INVESTIGATION
✓ Transaction verified
✓ Customer identified
✓ Product identified
✓ Purchase timestamp verified
✓ Course access verified
✓ Customer activity found
✓ Refund policy retrieved
✓ Terms accepted at checkout
8 pieces of evidence collected
```

### c) AI-generated case summary
> The customer purchased the Pro Coaching Program for $499 on August 2 at 14:32 UTC. Payment was successfully processed and the customer was granted access to the program at 14:33 UTC. Account activity shows 14 sessions and 6 lessons completed following purchase. The customer therefore received access to the purchased service and actively used it after the transaction. The available evidence supports the seller's position that the product was received and used.

### d) Evidence review table (AI-found vs. human-verified)

| Evidence | Status |
|---|---|
| Transaction receipt | AI found · Human verified |
| Course access timestamp | AI found · Human verified |
| Login history | AI found · Human verified |
| Lesson activity | AI found · **Needs review** |
| Product description | AI found · Human verified |
| Terms accepted | AI found · Human verified |
| Refund policy | AI found · Human verified |
| Customer communications | AI found · **Needs review** |

Case strength indicator: **Strong — 7/8 recommended evidence items found.**

Actions: `[ Review Evidence ]` `[ Submit Response ]` (Submit disabled until review complete).

### e) Customer journey timeline
Reconstructed timeline of the customer's journey (purchase → access → usage), shown during the demo.

### f) Evidence detail expansion
Expanding an evidence item shows the record plus its "Why it matters" explanation.

### g) Submission confirmation
Final "Submit Response" action — **simulated**, ending in a confirmation step.

## 6. Sample Data (deterministic)

One coaching-business scenario:

- **Customer:** Jane Smith
- **Offer:** Pro Coaching Program
- **Purchase:** $499 on August 2 at 14:32 UTC
- **Access granted:** August 2 at 14:33 UTC
- **Usage:** 14 sessions, 6 lessons completed
- **Terms accepted at checkout:** yes
- **Refund policy:** available
- **Support thread:** customer previously discussed access
- **Dispute reason:** Product not received
- **Response deadline:** 11 days from dispute creation (demo shows "Response due: Aug 18")
- **Dispute:** #1234, amount $499

Evidence set (8 items): transaction receipt, course access timestamp, login history, lesson activity, product description, terms accepted, refund policy, customer communications. Lesson activity and customer communications start as "Needs review"; the others can be verified.

## 7. Prototype Constraints

- **Thin orchestration layer** over mock data — do not rebuild Commas' MCP/CLI. Focus on product workflow and evidence synthesis.
- Architecture shape: Resolution Center UI → "Collect evidence with AI" → AI investigation orchestrator → data sources (transaction/customer, product/checkout, studio access/activity, policies/terms, support communications) → evidence normalization + ranking → customer journey timeline → recommended response + evidence list → human review → submit.
- Use **screenshots of the existing Resolution Center** as the visual reference; build a realistic UI extension, not a product redesign.
- Use **deterministic sample data** (above); implement the AI investigation against **structured mock tools/functions** so the demo behaves like a real agent workflow.
- **Submission is simulated.** The demo's substance is evidence collection, synthesis, review, and the final confirmation step.
- Demo must communicate the idea **in under five minutes**; goal is desirability, understandability, and technical plausibility — not production readiness.

### Demo script (in order)
1. Open a realistic Resolution Center dispute.
2. Show the existing manual evidence burden briefly.
3. Click "Collect evidence with AI."
4. Show investigation progress as evidence is collected.
5. Show the reconstructed customer journey.
6. Show the AI-generated recommended response.
7. Expand several evidence items and show "Why it matters."
8. Show AI-found vs. human-verified states.
9. Verify the evidence.
10. Show the final "Submit Response" action.
11. Close on how the architecture could learn from dispute outcomes over time.

### Guardrails (apply to prototype behavior)
- Never fabricate evidence; every factual claim in the draft traces to a source record.
- Do not infer access or usage when the underlying record is absent.
- Clearly label AI-generated summaries and recommendations.
- Require human review before submission.
- Preserve an audit trail (evidence sources, AI output, human verification, final submission).
- Handle missing or contradictory evidence explicitly rather than forcing a positive case.
- No unsupported claims about likelihood of winning the dispute.
