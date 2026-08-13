export type DisputePhase = "manual" | "investigating" | "review" | "submitted";

export const dispute = {
  id: "2481",
  reason: "Product not received",
  status: "Needs response" as const,
  amount: "$499.00",
  purchasedAt: "August 2, 2026 at 14:32 UTC",
  openedAt: "August 9, 2026",
  evidenceDueAt: "August 13, 2026",
  evidenceDueLabel: "Due tomorrow",
  customer: {
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    initials: "SJ",
  },
  product: {
    name: "Pro Coaching Program",
    transactionId: "txn_8b3f2a1c9d",
  },
};

export const investigationSteps = [
  "Transaction verified",
  "Customer identified",
  "Product identified",
  "Purchase timestamp verified",
  "Course access verified",
  "Customer activity found",
  "Refund policy retrieved",
  "Terms accepted at checkout",
];

export type EvidenceSourceType =
  | "transaction"
  | "activity"
  | "product"
  | "terms"
  | "communication"
  | "manual";

export type AIEvidenceItem = {
  id: string;
  title: string;
  record: string;
  why: string;
  sourceType: EvidenceSourceType;
  sourceLabel: string;
  /** which subsection of a shared source page (activity, terms) this item points to */
  sourceAnchor?: string;
  addedBy: "ai" | "seller";
};

export const initialEvidence: AIEvidenceItem[] = [
  {
    id: "receipt",
    title: "Transaction receipt",
    record:
      "Payment of $499.00 processed successfully on August 2, 2026 at 14:32 UTC · txn_8b3f2a1c9d · Visa ending 4242.",
    why: "Proves a valid, authorized charge matching the disputed amount, date, and payment method.",
    sourceType: "transaction",
    sourceLabel: "Payments → Transactions → txn_8b3f2a1c9d",
    addedBy: "ai",
  },
  {
    id: "access",
    title: "Course access timestamp",
    record:
      "Access to Pro Coaching Program granted on August 2, 2026 at 14:33 UTC — one minute after payment. Welcome email delivered at 14:33 UTC.",
    why: "Shows the product was delivered immediately after purchase — central to a “product not received” defense.",
    sourceType: "activity",
    sourceLabel: "Customer Analytics → Sarah Johnson → Activity",
    sourceAnchor: "access",
    addedBy: "ai",
  },
  {
    id: "logins",
    title: "Login history",
    record:
      "14 logins between August 2 and August 8, 2026. First login: August 3 at 10:32 AM, 18 hours after purchase.",
    why: "Supports that the customer was granted access and accessed the purchased service.",
    sourceType: "activity",
    sourceLabel: "Customer Analytics → Sarah Johnson → Activity",
    sourceAnchor: "logins",
    addedBy: "ai",
  },
  {
    id: "lessons",
    title: "Lesson activity",
    record:
      "6 of 12 lessons completed between August 2 and August 8. Most recent: “Week 2: Goal Mapping” on August 8.",
    why: "Demonstrates sustained use of the purchased content after delivery, not just a single access event.",
    sourceType: "activity",
    sourceLabel: "Customer Analytics → Sarah Johnson → Activity",
    sourceAnchor: "lessons",
    addedBy: "ai",
  },
  {
    id: "listing",
    title: "Product description",
    record:
      "Listing at time of purchase: “Pro Coaching Program — a 12-week online coaching program with weekly lessons and live group sessions.” Unchanged since July 14, 2026.",
    why: "Establishes exactly what was offered at checkout and that the delivered program matches the offer.",
    sourceType: "product",
    sourceLabel: "Products → Pro Coaching Program",
    addedBy: "ai",
  },
  {
    id: "terms",
    title: "Terms accepted",
    record:
      "Terms of Service v3.2 accepted at checkout on August 2, 2026 at 14:32 UTC from the customer's account.",
    why: "Confirms the customer agreed to the terms governing delivery and disputes before paying.",
    sourceType: "terms",
    sourceLabel: "Checkout Records → Terms & Policies",
    sourceAnchor: "terms",
    addedBy: "ai",
  },
  {
    id: "refund-policy",
    title: "Refund policy",
    record:
      "14-day refund policy displayed at checkout and linked in the receipt email. No refund request was received before the dispute was opened.",
    why: "Shows a refund path existed and was bypassed — the customer disputed the charge without contacting us first.",
    sourceType: "terms",
    sourceLabel: "Checkout Records → Terms & Policies",
    sourceAnchor: "policy",
    addedBy: "ai",
  },
  {
    id: "comms",
    title: "Customer communications",
    record:
      "Support thread, August 2–3: customer asked how to access the program shortly after purchase; support replied with the login link; customer confirmed access the next day.",
    why: "Indicates the customer knew how to access the program and confirmed successful access in writing.",
    sourceType: "communication",
    sourceLabel: "Support → Conversations → Sarah Johnson",
    addedBy: "ai",
  },
];

export const missingEvidence = {
  title: "Download records",
  note: "Not found — this offer has no downloadable files, so download evidence is not applicable.",
};

export const journeyEvents = [
  {
    when: "Aug 2, 14:32 UTC",
    title: "Purchase completed",
    detail: "$499.00 payment processed for Pro Coaching Program.",
    kind: "normal" as const,
  },
  {
    when: "Aug 2, 14:33 UTC",
    title: "Access granted",
    detail: "Enrolled in the program; welcome email delivered.",
    kind: "normal" as const,
  },
  {
    when: "Aug 3, 10:32 AM",
    title: "First login",
    detail: "18 hours after purchase.",
    kind: "normal" as const,
  },
  {
    when: "Aug 2 – Aug 8",
    title: "14 sessions",
    detail: "Average session length 24 minutes.",
    kind: "normal" as const,
  },
  {
    when: "Aug 8",
    title: "6 lessons completed",
    detail: "Most recent: “Week 2: Goal Mapping”.",
    kind: "normal" as const,
  },
  {
    when: "Aug 9",
    title: "Dispute opened",
    detail: "Reason: Product not received.",
    kind: "dispute" as const,
  },
];

export const caseSummary =
  "The customer purchased the Pro Coaching Program for $499 on August 2 at 14:32 UTC. Payment was successfully processed and the customer was granted access to the program at 14:33 UTC. Account activity shows 14 sessions and 6 lessons completed following purchase. The customer therefore received access to the purchased service and actively used it after the transaction. The available evidence supports the seller's position that the product was received and used.";

export const draftResponse =
  "Sarah Johnson purchased the Pro Coaching Program ($499.00) on August 2, 2026 at 14:32 UTC (transaction txn_8b3f2a1c9d). Access to the program was granted at 14:33 UTC, one minute after payment, and a welcome email was delivered.\n\nOur records show the customer logged in 14 times between August 2 and August 8, with the first login on August 3 at 10:32 AM, and completed 6 lessons in that period. Before and after purchase, the customer contacted our support team about accessing the program and confirmed in writing that she had gained access.\n\nThe customer accepted our Terms of Service and 14-day refund policy at checkout and did not request a refund before opening this dispute. The evidence shows the product was delivered immediately and used repeatedly. We ask that this dispute be resolved in the seller's favor.";

export const evidenceCategories = [
  {
    label: "Transaction & payment details",
    description: "Purchase confirmation, checkout details, payment method",
  },
  {
    label: "Customer & account information",
    description: "Customer identity, account creation, contact details",
  },
  {
    label: "Access & activity records",
    description: "Login history, course access, session activity",
  },
  {
    label: "Product description & offer details",
    description: "Listing shown at time of purchase",
  },
  {
    label: "Terms & refund policy",
    description: "Policy version and acceptance record",
  },
  {
    label: "Customer communications",
    description: "Support tickets, emails, chat history",
  },
];

/* ---------- source record data (what the "View evidence" pages show) ---------- */

export const transactionRecord = {
  customer: "Sarah Johnson",
  email: "sarah.johnson@email.com",
  amount: "$499.00",
  product: "Pro Coaching Program",
  status: "Succeeded",
  timestamp: "August 2, 2026 · 14:32 UTC",
  transactionId: "txn_8b3f2a1c9d",
  paymentMethod: "Visa •••• 4242",
  billingCountry: "United States",
};

export const activityRecord = {
  accessGrantedAt: "August 2, 2026 · 14:33 UTC",
  welcomeEmailAt: "August 2, 2026 · 14:33 UTC",
  logins: [
    { when: "Aug 3, 10:32 AM", duration: "31 min" },
    { when: "Aug 3, 7:14 PM", duration: "18 min" },
    { when: "Aug 4, 9:02 AM", duration: "22 min" },
    { when: "Aug 4, 8:45 PM", duration: "27 min" },
    { when: "Aug 5, 8:51 AM", duration: "19 min" },
    { when: "Aug 5, 9:03 PM", duration: "24 min" },
    { when: "Aug 6, 9:15 AM", duration: "26 min" },
    { when: "Aug 6, 8:22 PM", duration: "21 min" },
    { when: "Aug 7, 8:40 AM", duration: "23 min" },
    { when: "Aug 7, 7:58 PM", duration: "29 min" },
    { when: "Aug 8, 9:10 AM", duration: "25 min" },
    { when: "Aug 8, 2:30 PM", duration: "17 min" },
    { when: "Aug 8, 8:05 PM", duration: "33 min" },
    { when: "Aug 8, 9:47 PM", duration: "20 min" },
  ],
  lessons: [
    { title: "Week 1: Welcome & Goal Setting", status: "Completed", when: "Aug 3" },
    { title: "Week 1: Mindset Foundations", status: "Completed", when: "Aug 3" },
    { title: "Week 2: Accountability Systems", status: "Completed", when: "Aug 5" },
    { title: "Week 3: Time Management", status: "Completed", when: "Aug 6" },
    { title: "Week 3: Overcoming Obstacles", status: "Completed", when: "Aug 7" },
    { title: "Week 2: Goal Mapping", status: "Completed", when: "Aug 8" },
    { title: "Week 4: Building Habits", status: "Not started", when: null },
    { title: "Week 4: Weekly Check-in", status: "Not started", when: null },
    { title: "Week 5: Advanced Strategies", status: "Not started", when: null },
    { title: "Week 5: Live Q&A Recap", status: "Not started", when: null },
    { title: "Week 6: Momentum & Review", status: "Not started", when: null },
    { title: "Week 6: Midpoint Assessment", status: "Not started", when: null },
  ],
};

export const productRecord = {
  name: "Pro Coaching Program",
  price: "$499.00",
  description:
    "A 12-week online coaching program with weekly lessons and live group sessions, designed to help customers build sustainable habits with structured accountability.",
  deliveryType: "Instant access on purchase",
  lastUpdated: "July 14, 2026",
  purchaseContext: "Shown at checkout exactly as listed — no changes since purchase.",
};

export const termsRecord = {
  termsVersion: "v3.2",
  termsAcceptedAt: "August 2, 2026 · 14:32 UTC",
  termsAcceptedFrom: "Customer account at checkout",
  refundPolicy: "14-day money-back guarantee from date of purchase.",
  refundPolicyDisplayedAt: "Checkout page and order confirmation email",
  refundRequests: "None on file for this customer",
};

export const communicationThread = [
  {
    from: "Sarah Johnson",
    when: "Aug 2, 14:40 UTC",
    message: "Hi, I just purchased the Pro Coaching Program but I'm not sure how to access it — can you help?",
  },
  {
    from: "Alex (Support)",
    when: "Aug 2, 15:02 UTC",
    message:
      "Hi Sarah! Thanks for joining Pro Coaching Program. You should have a welcome email with your login link — here's the direct link too. Let me know if you have trouble logging in!",
  },
  {
    from: "Sarah Johnson",
    when: "Aug 3, 10:35 AM",
    message: "Got it, thanks! I'm in now.",
  },
];
