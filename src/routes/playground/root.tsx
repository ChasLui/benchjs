import { useEffect, useRef, useState } from "react";
import { Route } from ".react-router/types/src/routes/playground/+types/root";
import { Share2Icon } from "lucide-react";
import { Link } from "react-router";
import { BenchmarkRun, useBenchmarkStore } from "@/stores/benchmarkStore";
import { Implementation, usePersistentStore } from "@/stores/persistentStore";
import { useMonacoTabs } from "@/hooks/useMonacoTabs";
import { CodeView } from "@/routes/playground/views/code/index";
import { CompareView } from "@/routes/playground/views/compare";
import { SettingsView } from "@/routes/playground/views/settings";
import { DependencyService } from "@/services/dependencies/DependencyService";
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
      content:
        "BenchJS - JavaScript benchmarking in your browser. Run, compare, and share JavaScript benchmarks with ease.",
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

  const dependencyService = useRef(new DependencyService());
  useEffect(() => {
    for (const library of store.libraries) {
      dependencyService.current.addLibrary({ name: library.name });
    }
  }, [store.libraries]);

  return (
    <div className="flex flex-col h-screen">
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
          {activeTab === "code" && (
            <CodeView dependencyService={dependencyService.current} monacoTabs={monacoTabs} />
          )}
          {activeTab === "compare" && <CompareView />}
          {activeTab === "settings" && <SettingsView dependencyService={dependencyService.current} />}
        </div>
      </div>

      <ShareDialog
        implementations={shareData?.implementations ?? []}
        open={Boolean(shareData)}
        runs={shareData?.runs ?? {}}
        shareUrl={shareData?.shareUrl ?? ""}
        onOpenChange={(open) => setShareData(open ? shareData : null)}
      />

      <div className="flex fixed top-0 right-0 bottom-0 left-0 z-50 justify-center items-center p-4 w-full h-full sm:hidden bg-black/50 backdrop-blur-sm dark:bg-black/80">
        <div className="flex flex-col gap-4 justify-center items-center p-4 py-8 text-center bg-card border-2 border-border rounded-lg">
          <h1 className="mb-4 text-2xl font-bold">Mobile is not supported 🫠</h1>
          <p>
            The playground includes a code editor and many tabs, and it&apos;s not a good experience on
            mobile, please use a desktop browser.
          </p>
          <Link to="/">
            <Button variant="outline">Go back</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
