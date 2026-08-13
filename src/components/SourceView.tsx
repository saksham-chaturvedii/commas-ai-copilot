import type { ReactNode } from "react";
import {
  ArrowLeft,
  Receipt,
  Activity,
  Package,
  ScrollText,
  MessageSquare,
  FilePlus,
  CircleCheck,
  Circle,
} from "lucide-react";
import { CardTitle } from "./EvidenceCopilot";
import {
  dispute,
  transactionRecord,
  activityRecord,
  productRecord,
  termsRecord,
  communicationThread,
  type AIEvidenceItem,
} from "../mockData";

const SOURCE_META: Record<
  AIEvidenceItem["sourceType"],
  { icon: typeof Receipt; pageTitle: string }
> = {
  transaction: { icon: Receipt, pageTitle: "Transaction record" },
  activity: { icon: Activity, pageTitle: "Customer activity" },
  product: { icon: Package, pageTitle: "Product details" },
  terms: { icon: ScrollText, pageTitle: "Terms & policies" },
  communication: { icon: MessageSquare, pageTitle: "Support conversation" },
  manual: { icon: FilePlus, pageTitle: "Manually added evidence" },
};

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="detail-row">
      <div className="flex-1 min-w-0">
        <div className="text-[12px] leading-[16px] text-[#9ca3af]">{label}</div>
        <div className="text-[14px] leading-[20px] font-medium text-[#1a1a1a] mt-0.5">{value}</div>
      </div>
    </div>
  );
}

function Highlight({ active, children }: { active: boolean; children: ReactNode }) {
  return (
    <div
      className="rounded-lg px-3.5 py-3"
      style={
        active
          ? { background: "#edf3ff", border: "1px solid #aed3fa" }
          : { background: "#fafafa", border: "1px solid #ebebeb" }
      }
    >
      {children}
    </div>
  );
}

function TransactionSource() {
  const r = transactionRecord;
  return (
    <div className="content-card" style={{ padding: 24, gap: 0 }}>
      <CardTitle>Transaction</CardTitle>
      <div className="mt-2">
        <Field label="Customer" value={r.customer} />
        <Field label="Amount" value={r.amount} />
        <Field label="Product" value={r.product} />
        <Field label="Payment status" value={r.status} />
        <Field label="Timestamp" value={r.timestamp} />
        <Field label="Transaction ID" value={r.transactionId} />
        <Field label="Payment method" value={r.paymentMethod} />
        <Field label="Billing country" value={r.billingCountry} />
      </div>
    </div>
  );
}

function ActivitySource({ anchor }: { anchor?: string }) {
  const r = activityRecord;
  return (
    <>
      <div className="content-card" style={{ padding: 24, gap: 0 }} id="source-access">
        <CardTitle>Access</CardTitle>
        <div className="mt-2">
          <Highlight active={anchor === "access"}>
            <div className="text-[12px] text-[#9ca3af]">Access granted</div>
            <div className="text-[14px] font-medium text-[#1a1a1a] mt-0.5">
              {r.accessGrantedAt}
            </div>
            <div className="text-[12px] text-[#9ca3af] mt-2">Welcome email delivered</div>
            <div className="text-[14px] font-medium text-[#1a1a1a] mt-0.5">
              {r.welcomeEmailAt}
            </div>
          </Highlight>
        </div>
      </div>

      <div className="content-card" style={{ padding: 24, gap: 0 }} id="source-logins">
        <div className="flex items-baseline justify-between">
          <CardTitle>Login sessions</CardTitle>
          <span className="text-[12px] text-[#9ca3af]">{r.logins.length} sessions</span>
        </div>
        <div
          className="mt-3 rounded-lg overflow-hidden"
          style={
            anchor === "logins"
              ? { border: "1px solid #aed3fa" }
              : { border: "1px solid #ebebeb" }
          }
        >
          <div className="flex items-center gap-4 px-4 py-2.5 bg-[#fafafa] border-b border-[#ebebeb]">
            <div className="flex-1 text-[12px] font-medium text-[#6b7280]">Date & time</div>
            <div className="w-[100px] text-[12px] font-medium text-[#6b7280]">Duration</div>
          </div>
          {r.logins.map((l, i) => (
            <div
              key={i}
              className="flex items-center gap-4 px-4 py-2.5 border-b border-[#ebebeb] last:border-b-0"
              style={i === 0 && anchor === "logins" ? { background: "#edf3ff" } : undefined}
            >
              <div className="flex-1 text-[13px] text-[#1a1a1a]">
                {l.when}
                {i === 0 && (
                  <span className="ml-2 text-[11px] text-[#4f7fcd] font-medium">First login</span>
                )}
              </div>
              <div className="w-[100px] text-[13px] text-[#727272]">{l.duration}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="content-card" style={{ padding: 24, gap: 0 }} id="source-lessons">
        <div className="flex items-baseline justify-between">
          <CardTitle>Lesson activity</CardTitle>
          <span className="text-[12px] text-[#9ca3af]">
            {r.lessons.filter((l) => l.status === "Completed").length} of {r.lessons.length}{" "}
            completed
          </span>
        </div>
        <div className="mt-2">
          {r.lessons.map((l, i) => {
            const done = l.status === "Completed";
            const isMostRecent = done && l.when === "Aug 8";
            return (
              <div
                key={i}
                className="flex items-center gap-2.5 py-2 border-t border-[#ebebeb] first:border-t-0"
                style={
                  isMostRecent && anchor === "lessons" ? { background: "#edf3ff" } : undefined
                }
              >
                {done ? (
                  <CircleCheck size={16} strokeWidth={2} className="text-[#4e9b11] shrink-0" />
                ) : (
                  <Circle size={16} strokeWidth={1.75} className="text-[#d1d5db] shrink-0" />
                )}
                <span
                  className={
                    "text-[13px] flex-1 " + (done ? "text-[#1a1a1a] font-medium" : "text-[#9ca3af]")
                  }
                >
                  {l.title}
                </span>
                {l.when && <span className="text-[12px] text-[#9ca3af]">{l.when}</span>}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

function ProductSource() {
  const r = productRecord;
  return (
    <div className="content-card" style={{ padding: 24, gap: 0 }}>
      <CardTitle>Product listing</CardTitle>
      <div className="mt-2">
        <Field label="Product name" value={r.name} />
        <Field label="Price" value={r.price} />
        <Field label="Delivery type" value={r.deliveryType} />
        <Field label="Last updated" value={r.lastUpdated} />
      </div>
      <div className="mt-3 pt-3 border-t border-[#ebebeb]">
        <div className="text-[12px] text-[#9ca3af] mb-1">Description shown at checkout</div>
        <div className="text-[14px] leading-[21px] text-[#1a1a1a]">{r.description}</div>
      </div>
      <div className="mt-3 text-[12px] text-[#9ca3af]">{r.purchaseContext}</div>
    </div>
  );
}

function TermsSource({ anchor }: { anchor?: string }) {
  const r = termsRecord;
  return (
    <>
      <div className="content-card" style={{ padding: 24, gap: 0 }} id="source-terms">
        <CardTitle>Terms of Service</CardTitle>
        <div className="mt-2">
          <Highlight active={anchor === "terms"}>
            <Field label="Version" value={r.termsVersion} />
            <Field label="Accepted at" value={r.termsAcceptedAt} />
            <Field label="Accepted from" value={r.termsAcceptedFrom} />
          </Highlight>
        </div>
      </div>
      <div className="content-card" style={{ padding: 24, gap: 0 }} id="source-policy">
        <CardTitle>Refund policy</CardTitle>
        <div className="mt-2">
          <Highlight active={anchor === "policy"}>
            <Field label="Policy" value={r.refundPolicy} />
            <Field label="Displayed at" value={r.refundPolicyDisplayedAt} />
            <Field label="Refund requests on file" value={r.refundRequests} />
          </Highlight>
        </div>
      </div>
    </>
  );
}

function CommunicationSource() {
  return (
    <div className="content-card" style={{ padding: 24, gap: 0 }}>
      <div className="flex items-baseline justify-between">
        <CardTitle>Support conversation</CardTitle>
        <span className="text-[12px] text-[#9ca3af]">{dispute.customer.name}</span>
      </div>
      <div className="mt-3 flex flex-col gap-3">
        {communicationThread.map((m, i) => {
          const isCustomer = m.from === dispute.customer.name;
          return (
            <div
              key={i}
              className="rounded-lg px-3.5 py-3"
              style={{
                background: isCustomer ? "#fafafa" : "#edf3ff",
                border: `1px solid ${isCustomer ? "#ebebeb" : "#aed3fa"}`,
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-semibold text-[#1a1a1a]">{m.from}</span>
                <span className="text-[12px] text-[#9ca3af]">{m.when}</span>
              </div>
              <div className="text-[13px] leading-[19px] text-[#404040] mt-1">{m.message}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ManualSource({ item }: { item: AIEvidenceItem }) {
  return (
    <div className="content-card" style={{ padding: 24, gap: 0 }}>
      <CardTitle>Manually added evidence</CardTitle>
      <div className="mt-3 text-[12px] text-[#9ca3af]">
        This record has no AI-collected source — it was entered directly by the seller.
      </div>
      <div className="mt-3 rounded-lg bg-[#fafafa] border border-[#ebebeb] px-3.5 py-3">
        <div className="text-[12px] text-[#9ca3af]">Entered by seller</div>
        <div className="text-[14px] leading-[21px] text-[#1a1a1a] mt-1">{item.record}</div>
      </div>
    </div>
  );
}

export function SourceView({
  item,
  onBack,
}: {
  item: AIEvidenceItem;
  onBack: () => void;
}) {
  const meta = SOURCE_META[item.sourceType];
  const Icon = meta.icon;

  return (
    <div className="main-surface flex flex-col p-0 min-h-[370px] pt-[30px] px-5 pb-5 flex-1 overflow-y-auto">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 pl-[5px] text-[13px] font-medium text-[#6b7280] hover:text-[#1a1a1a] transition-colors w-fit cursor-pointer"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        <ArrowLeft size={14} strokeWidth={2} />
        Back to dispute #{dispute.id}
      </button>

      <div className="flex items-center gap-2.5 mt-3 pl-[5px]">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#fafafa] border border-[#ebebeb] shrink-0">
          <Icon size={16} strokeWidth={1.75} className="text-[#6b7280]" />
        </span>
        <h1
          className="text-[20px] leading-[26px] font-semibold tracking-[-0.4px] text-[#1a1a1a]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {meta.pageTitle}
        </h1>
      </div>
      <div className="pl-[45px] mt-1 text-[12px] text-[#9ca3af]">{item.sourceLabel}</div>

      <div className="mt-5 border-t border-black/[0.06]" />

      <div className="mt-5 max-w-[760px]">
        <div className="rounded-lg bg-[#fafafa] border border-[#ebebeb] px-4 py-3 mb-5">
          <div className="text-[11px] font-semibold uppercase tracking-[0.22px] text-black/40">
            Verifying
          </div>
          <div className="text-[14px] font-medium text-[#1a1a1a] mt-1">{item.title}</div>
          <div className="text-[13px] leading-[19px] text-[#404040] mt-1">{item.record}</div>
        </div>

        <div className="flex flex-col gap-5">
          {item.sourceType === "transaction" && <TransactionSource />}
          {item.sourceType === "activity" && <ActivitySource anchor={item.sourceAnchor} />}
          {item.sourceType === "product" && <ProductSource />}
          {item.sourceType === "terms" && <TermsSource anchor={item.sourceAnchor} />}
          {item.sourceType === "communication" && <CommunicationSource />}
          {item.sourceType === "manual" && <ManualSource item={item} />}
        </div>

        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 mt-5 text-[13px] font-medium text-[#6b7280] hover:text-[#1a1a1a] transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} strokeWidth={2} />
          Back to evidence review
        </button>
      </div>
    </div>
  );
}
