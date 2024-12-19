import { useMemo, useState } from "react";
import { useBenchmarkStore } from "@/stores/benchmarkStore";
import { useMonacoTabs } from "@/hooks/useMonacoTabs";
import { cn } from "@/lib/utils";
import { CodeView } from "@/routes/editor/views/code/index";
import { FileTree, FileTreeItem } from "@/components/common/FileTree";
import { Sidebar, SidebarTab } from "@/components/editor/Sidebar";
import { TopBar } from "@/components/editor/TopBar";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

const MIN_SIDEBAR_WIDTH = 280;

export default function EditorRoute() {
  const store = useBenchmarkStore();
  const monacoTabs = useMonacoTabs();

  const [activeTab, setActiveTab] = useState<SidebarTab>("code");

  const root = useMemo<FileTreeItem>(() => {
    return {
      name: "root",
      type: "root",
      children: [
        {
          name: "implementations",
          type: "folder",
          children: store.implementations.map((item) => ({
            name: item.filename,
            type: "file",
            actions: {
              onRename: (newName: string) => {
                store.renameImplementation(item.filename, newName);
              },
              onDelete: () => {
                store.removeImplementation(item.filename);
              },
            },
          })),
          actions: {
            onCreate: () => {
              const newName = `implementation-${store.implementations.length + 1}.ts`;
              store.updateImplementation(newName, "// Write your implementation here\n");
              monacoTabs.openTab(newName);
            },
          },
        },
        {
          name: "setup.ts",
          type: "file",
        },
        {
          name: "README.md",
          type: "file",
        },
      ],
    };
  }, [monacoTabs, store]);

  const defaultSidebarSize = (MIN_SIDEBAR_WIDTH * 100) / window.innerWidth;

  return (
    <div className="flex flex-col h-screen">
      {/* top bar */}
      <TopBar />

      <ResizablePanelGroup className="flex flex-1 w-full" direction="horizontal">
        <ResizablePanel
          className={cn("flex")}
          defaultSize={defaultSidebarSize}
          style={{ minWidth: `${MIN_SIDEBAR_WIDTH}px` }}
        >
          {/* sidebar */}
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

          {/* sidebar panel */}
          {activeTab === "code" && (
            <div className="flex-1 px-1 h-full text-sm bg-zinc-100">
              <div className="p-2 font-medium uppercase">Code</div>
              <FileTree
                activeFile={monacoTabs.activeTabName || undefined}
                item={root}
                level={0}
                onFileClick={(item) => monacoTabs.openTab(item.name)}
              />
            </div>
          )}
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel>
          {activeTab === "code" && <CodeView monacoTabs={monacoTabs} />}
          {activeTab === "environment" && <div className="p-4">environment</div>}
          {activeTab === "settings" && <div className="p-4">settings</div>}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
