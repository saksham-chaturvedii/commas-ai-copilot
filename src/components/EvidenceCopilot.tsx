import { useEffect, useState, type ReactNode } from "react";
import {
  Check,
  ChevronDown,
  CircleDashed,
  FileText,
  CircleCheck,
  RotateCcw,
} from "lucide-react";
import { Badge } from "./Badge";
import { PinwheelIcon } from "./PinwheelIcon";
import {
  investigationSteps,
  missingEvidence,
  journeyEvents,
  caseSummary,
  type AIEvidenceItem,
} from "../mockData";

/* ---------- shared bits ---------- */

function GreenCheck({ size = 20 }: { size?: number }) {
  return (
    <span
      className="flex items-center justify-center rounded-full shrink-0"
      style={{ width: size, height: size, background: "#e4f5d6" }}
    >
      <Check size={size * 0.55} strokeWidth={3} color="#4e9b11" />
    </span>
  );
}

export function CardTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-[14px] leading-[21px] font-semibold tracking-[-0.2px] text-[#1a1a1a]">
      {children}
    </h2>
  );
}

/* ---------- investigation ---------- */

export function InvestigationCard({ onDone }: { onDone: () => void }) {
  const [done, setDone] = useState(0);

  useEffect(() => {
    if (done >= investigationSteps.length) {
      const t = setTimeout(onDone, 900);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setDone((d) => d + 1), 420);
    return () => clearTimeout(t);
  }, [done, onDone]);

  return (
    <div className="content-card" style={{ padding: 24, gap: 0 }}>
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.22px] text-black/40">
          AI investigation
        </span>
      </div>
      <div className="mt-4 flex flex-col gap-3">
        {investigationSteps.map((step, i) => {
          const state = i < done ? "done" : i === done ? "current" : "pending";
          return (
            <div key={step} className="flex items-center gap-3">
              {state === "done" ? (
                <GreenCheck />
              ) : state === "current" ? (
                <span className="flex items-center justify-center w-5 h-5 shrink-0 text-[#4f7fcd] animate-spin">
                  <PinwheelIcon size={16} />
                </span>
              ) : (
                <CircleDashed size={20} strokeWidth={1.5} className="text-[#d1d5db] shrink-0" />
              )}
              <span
                className={
                  "text-[14px] leading-[20px] " +
                  (state === "pending" ? "text-[#9ca3af]" : "text-[#1a1a1a] font-medium")
                }
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-4 pt-3 border-t border-[#ebebeb] text-[12px] leading-[17px] text-[#727272]">
        {done < investigationSteps.length
          ? `Collecting evidence from your records… ${done} of ${investigationSteps.length}`
          : "8 pieces of evidence collected"}
      </div>
    </div>
  );
}

/* ---------- case summary ---------- */

export function CaseSummaryCard({ evidenceCount }: { evidenceCount: number }) {
  return (
    <div className="content-card" style={{ padding: 24, gap: 0 }}>
      <div className="flex items-center gap-2.5">
        <CardTitle>Case summary</CardTitle>
        <Badge variant="info">AI-generated</Badge>
      </div>
      <p className="mt-3 text-[14px] leading-[22px] text-[#404040]">{caseSummary}</p>
      <div className="mt-3 pt-3 border-t border-[#ebebeb] text-[12px] leading-[17px] text-[#9ca3af]">
        Generated only from the {evidenceCount} records collected below — review before
        submitting.
      </div>
    </div>
  );
}

/* ---------- customer journey ---------- */

export function JourneyCard() {
  return (
    <div className="content-card" style={{ padding: 24, gap: 0 }}>
      <CardTitle>Customer journey</CardTitle>
      <div className="mt-4">
        {journeyEvents.map((ev, i) => {
          const last = i === journeyEvents.length - 1;
          const dispute = ev.kind === "dispute";
          return (
            <div key={ev.title} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 mt-1"
                  style={{
                    background: dispute ? "#fdecee" : "#e4f5d6",
                    boxShadow: `inset 0 0 0 2px ${dispute ? "#d5384b" : "#4e9b11"}`,
                  }}
                />
                {!last && <span className="w-px flex-1 bg-[#ebebeb] my-1" />}
              </div>
              <div className={last ? "pb-0" : "pb-4"}>
                <div className="text-[12px] leading-[16px] text-[#9ca3af]">{ev.when}</div>
                <div className="text-[14px] leading-[20px] font-medium text-[#1a1a1a] mt-0.5">
                  {ev.title}
                </div>
                <div className="text-[12px] leading-[17px] text-[#727272] mt-0.5">{ev.detail}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- evidence review ---------- */

export function EvidenceReviewCard({
  evidence,
  verified,
  onVerify,
  onUnverify,
  onVerifyAll,
  onViewEvidence,
  onAddEvidence,
}: {
  evidence: AIEvidenceItem[];
  verified: Set<string>;
  onVerify: (id: string) => void;
  onUnverify: (id: string) => void;
  onVerifyAll: () => void;
  onViewEvidence: (item: AIEvidenceItem) => void;
  onAddEvidence: () => void;
}) {
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(evidence[0] ? [evidence[0].id] : [])
  );

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const allVerified = verified.size === evidence.length && evidence.length > 0;

  return (
    <div className="content-card" style={{ padding: 24, gap: 0 }} id="evidence-card">
      <div className="flex items-center justify-between">
        <CardTitle>Evidence</CardTitle>
        <div className="flex items-center gap-3">
          <span className="text-[12px] text-[#9ca3af]">
            {verified.size} of {evidence.length} verified
          </span>
          {!allVerified && evidence.length > 0 && (
            <button
              type="button"
              className="btn-toolbar"
              style={{ height: 29 }}
              onClick={onVerifyAll}
            >
              Verify all
            </button>
          )}
          <button
            type="button"
            className="btn-toolbar"
            style={{ height: 29 }}
            onClick={onAddEvidence}
          >
            Add evidence
          </button>
        </div>
      </div>
      <div className="mt-1 text-[12px] text-[#9ca3af]">
        Strong case · {evidence.length} of {evidence.length + 1} recommended items found by AI
      </div>

      <div className="mt-2">
        {evidence.map((item) => {
          const isVerified = verified.has(item.id);
          const isOpen = expanded.has(item.id);
          return (
            <div key={item.id} className="border-t border-[#ebebeb] first:border-t-0 py-3">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#fafafa] border border-[#ebebeb] shrink-0 mt-0.5">
                  <FileText size={15} strokeWidth={1.75} className="text-[#9ca3af]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] leading-[20px] font-medium text-[#1a1a1a] truncate">
                      {item.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggle(item.id)}
                      aria-label={isOpen ? "Collapse details" : "Expand details"}
                      className="flex items-center justify-center w-5 h-5 shrink-0 cursor-pointer ml-auto"
                    >
                      <ChevronDown
                        size={14}
                        strokeWidth={2}
                        className="text-[#9ca3af] transition-transform"
                        style={{ transform: isOpen ? "rotate(180deg)" : undefined }}
                      />
                    </button>
                  </div>
                  <div className="text-[12px] leading-[16px] text-[#9ca3af] mt-0.5">
                    Source: {item.sourceLabel}
                  </div>
                  <div className="flex items-center gap-2 mt-2.5">
                    <span className="text-[12px] leading-[16px] text-[#9ca3af]">
                      AI found
                      {isVerified && (
                        <>
                          {" · "}
                          <span className="text-[#4e9b11] font-medium">Human verified</span>
                        </>
                      )}
                    </span>
                    <div className="flex-1" />
                    <button
                      type="button"
                      className="btn-toolbar shrink-0"
                      style={{ height: 29 }}
                      onClick={() => onViewEvidence(item)}
                    >
                      View evidence
                    </button>
                    <button
                      type="button"
                      className="btn-toolbar shrink-0"
                      style={{ height: 29 }}
                      onClick={() => (isVerified ? onUnverify(item.id) : onVerify(item.id))}
                    >
                      {isVerified ? "Unverify" : "Verify"}
                    </button>
                  </div>
                </div>
              </div>
              {isOpen && (
                <div className="mt-3 ml-11 rounded-lg bg-[#fafafa] border border-[#ebebeb] px-3.5 py-3">
                  <div className="text-[13px] leading-[19px] text-[#404040]">{item.record}</div>
                  <div className="mt-2.5 text-[11px] font-semibold uppercase tracking-[0.22px] text-black/40">
                    Why it matters
                  </div>
                  <div className="text-[13px] leading-[19px] text-[#404040] mt-1">{item.why}</div>
                </div>
              )}
            </div>
          );
        })}

        {/* missing evidence, flagged explicitly — nothing to inspect or verify */}
        <div className="flex items-center gap-3 py-3 border-t border-[#ebebeb]">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#fafafa] border border-dashed border-[#d1d5db] shrink-0">
            <FileText size={15} strokeWidth={1.75} className="text-[#d1d5db]" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[14px] leading-[20px] font-medium text-[#9ca3af]">
              {missingEvidence.title}
            </span>
            <div className="text-[12px] leading-[16px] text-[#9ca3af] mt-0.5">
              {missingEvidence.note}
            </div>
          </div>
          <Badge variant="neutral">Not found</Badge>
        </div>
      </div>
    </div>
  );
}

/* ---------- submitted confirmation ---------- */

export function SubmittedCard({
  evidenceCount,
  verifiedCount,
  onReset,
}: {
  evidenceCount: number;
  verifiedCount: number;
  onReset: () => void;
}) {
  return (
    <div className="content-card items-center justify-center" style={{ padding: 24, gap: 0 }}>
      <div
        className="flex items-center justify-center w-10 h-10 rounded-full"
        style={{ background: "#e4f5d6", color: "#4e9b11" }}
      >
        <CircleCheck size={20} strokeWidth={2} />
      </div>
      <div
        className="text-[13px] leading-[19px] font-semibold text-[#1a1a1a]"
        style={{ fontFamily: "var(--font-heading)", marginTop: 12 }}
      >
        Response submitted
      </div>
      <div
        className="text-[12px] leading-[17px] font-normal text-[#727272]"
        style={{ fontFamily: "var(--font-heading)", marginTop: 2 }}
      >
        Your response and {verifiedCount} verified evidence items were sent to the card network.
      </div>
      <div
        className="text-[12px] leading-[17px] text-[#727272] text-center"
        style={{ marginTop: 16 }}
      >
        AI found {evidenceCount} items · You verified {verifiedCount} · Submitted Aug 13, 2026
      </div>
      <div
        className="text-[12px] leading-[17px] text-[#9ca3af] text-center"
        style={{ marginTop: 12, maxWidth: 420 }}
      >
        A full audit trail of what the AI found, what you verified, and what was submitted has been
        saved to this dispute.
      </div>
      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#9ca3af] hover:text-[#6b7280] cursor-pointer"
        style={{ marginTop: 20 }}
      >
        <RotateCcw size={12} strokeWidth={2} />
        Reset demo
      </button>
    </div>
  );
}
