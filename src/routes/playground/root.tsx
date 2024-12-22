import { useState } from "react";
import { Route } from ".react-router/types/src/routes/playground/+types/root";
import { BenchmarkRun, useBenchmarkStore } from "@/stores/benchmarkStore";
import { Implementation, usePersistentStore } from "@/stores/persistentStore";
import { useMonacoTabs } from "@/hooks/useMonacoTabs";
import { CodeView } from "@/routes/playground/views/code/index";
import { CompareView } from "@/routes/playground/views/compare";
import { ShareDialog } from "@/components/playground/ShareDialog";
import { Sidebar, SidebarTab } from "@/components/playground/Sidebar";
import { TopBar } from "@/components/playground/TopBar";

type ShareDialogPayload = {
  implementations: Implementation[];
  runs: Record<string, BenchmarkRun[]>;
  shareUrl: string;
};

// eslint-disable-next-line no-empty-pattern
export function meta({}: Route.MetaArgs) {
  return [
    //
    { title: "Playground - BenchJS" },
    { name: "description", content: "BenchJS - lean JavaScript benchmarking" },
  ];
}

export default function EditorRoute() {
  const store = usePersistentStore();
  const monacoTabs = useMonacoTabs(store.implementations, {
    initialActiveTabId: store.activeTabId,
    onTabChange: (tabId: string | null) => {
      store.setActiveTabId(tabId);
    },
  });
  const [activeTab, setActiveTab] = useState<SidebarTab>("code");

  const [shareData, setShareData] = useState<ShareDialogPayload | null>(null);

  const handleShare = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}${window.location.hash}`;
    setShareData({
      implementations: usePersistentStore.getState().implementations,
      runs: useBenchmarkStore.getState().runs,
      shareUrl,
    });
  };

  return (
    <div className="flex flex-col h-screen">
      {/* top bar */}
      <TopBar onShare={handleShare} />

      <div className="flex overflow-hidden flex-1 w-full">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex overflow-auto flex-col flex-1 h-full">
          {activeTab === "code" && <CodeView monacoTabs={monacoTabs} />}
          {activeTab === "compare" && <CompareView />}
          {activeTab === "environment" && <div className="p-4">environment</div>}
          {activeTab === "settings" && <div className="p-4">settings</div>}
        </div>
      </div>

      <ShareDialog
        implementations={shareData?.implementations ?? []}
        open={Boolean(shareData)}
        runs={shareData?.runs ?? {}}
        shareUrl={shareData?.shareUrl ?? ""}
        onOpenChange={(open) => setShareData(open ? shareData : null)}
      />
    </div>
  );
}
