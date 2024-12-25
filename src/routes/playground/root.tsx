import { useState } from "react";
import { Route } from ".react-router/types/src/routes/playground/+types/root";
import { Share2Icon } from "lucide-react";
import { BenchmarkRun, useBenchmarkStore } from "@/stores/benchmarkStore";
import { Implementation, usePersistentStore } from "@/stores/persistentStore";
import { useMonacoTabs } from "@/hooks/useMonacoTabs";
import { CodeView } from "@/routes/playground/views/code/index";
import { CompareView } from "@/routes/playground/views/compare";
import { Header } from "@/components/layout/Header";
import { ShareDialog } from "@/components/playground/ShareDialog";
import { Sidebar, SidebarTab } from "@/components/playground/Sidebar";
import { Button } from "@/components/ui/button";

type ShareDialogPayload = {
  implementations: Implementation[];
  runs: Record<string, BenchmarkRun[]>;
  shareUrl: string;
};

// eslint-disable-next-line no-empty-pattern
export function meta({}: Route.MetaArgs) {
  return [
    { title: "BenchJS - JavaScript Benchmarking" },
    {
      name: "description",
      content: "BenchJS - JavaScript benchmarking in your browser",
    },
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
      <Header
        className="static"
        customNav={
          <Button className="gap-2" variant="outline" onClick={handleShare}>
            <Share2Icon className="w-4 h-4" />
            Share
          </Button>
        }
      />

      <div className="flex overflow-hidden flex-1 w-full">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex overflow-auto flex-col flex-1 h-full">
          {activeTab === "code" && <CodeView monacoTabs={monacoTabs} />}
          {activeTab === "compare" && <CompareView />}
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
