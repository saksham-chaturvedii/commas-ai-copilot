import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { TopNav } from "./components/TopNav";
import { ResolutionCenter } from "./components/ResolutionCenter";
import { DisputeDetail } from "./components/DisputeDetail";
import { SourceView } from "./components/SourceView";
import { initialEvidence, type AIEvidenceItem, type DisputePhase } from "./mockData";

type View = "list" | "detail" | "source";

export default function App() {
  const [view, setView] = useState<View>("list");
  const [phase, setPhase] = useState<DisputePhase>("manual");
  const [evidence, setEvidence] = useState<AIEvidenceItem[]>(initialEvidence);
  const [verified, setVerified] = useState<Set<string>>(new Set());
  const [response, setResponse] = useState("");
  const [sourceItem, setSourceItem] = useState<AIEvidenceItem | null>(null);

  const openDispute = () => setView("detail");
  const backToList = () => setView("list");

  const viewEvidence = (item: AIEvidenceItem) => {
    setSourceItem(item);
    setView("source");
  };
  const backToDispute = () => setView("detail");

  const resetDemo = () => {
    setPhase("manual");
    setEvidence(initialEvidence);
    setVerified(new Set());
    setResponse("");
    setSourceItem(null);
    setView("list");
  };

  return (
    <div className="app-shell-bg p-0 min-[992px]:pt-3 min-[992px]:pr-4 min-[992px]:pb-3 min-[992px]:pl-2.5">
      <div className="flex flex-col min-[992px]:flex-row min-[992px]:gap-2.5 h-dvh min-[992px]:h-[calc(100dvh-1.5rem)]">
        <Sidebar />
        <div className="flex flex-col min-w-0 flex-1 h-full gap-3">
          <TopNav />
          {view === "detail" && (
            <DisputeDetail
              onBack={backToList}
              phase={phase}
              setPhase={setPhase}
              evidence={evidence}
              setEvidence={setEvidence}
              verified={verified}
              setVerified={setVerified}
              response={response}
              setResponse={setResponse}
              onViewEvidence={viewEvidence}
              onReset={resetDemo}
            />
          )}
          {view === "source" && sourceItem && (
            <SourceView item={sourceItem} onBack={backToDispute} />
          )}
          {view === "list" && <ResolutionCenter onOpenDispute={openDispute} phase={phase} />}
        </div>
      </div>
    </div>
  );
}
