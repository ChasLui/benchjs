import { useCallback, useMemo, useState } from "react";
import { useBenchmarkStore } from "@/stores/benchmarkStore";
import { useMonacoTabs } from "@/hooks/useMonacoTabs";
import { cn } from "@/lib/utils";
import { CodeView } from "@/routes/editor/views/code/index";
import { FileTree, FileTreeItem } from "@/components/common/FileTree";
import { EditorTopBar } from "@/components/editor/EditorTopBar";
import { Sidebar, SidebarTab } from "@/components/editor/Sidebar";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

const MIN_SIDEBAR_WIDTH = 280;

export default function EditorRoute() {
  const store = useBenchmarkStore();
  const [activeTab, setActiveTab] = useState<SidebarTab>("code");
  const {
    tabs: monacoTabs,
    activeTabName: activeMonacoTabName,
    changeTab: changeMonacoTab,
    closeTab: closeMonacoTab,
    openTab: openMonacoTab,
    setTabs: setMonacoTabs,
  } = useMonacoTabs();

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
              openMonacoTab(newName);
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
  }, [store, openMonacoTab]);

  const defaultSidebarSize = (MIN_SIDEBAR_WIDTH * 100) / window.innerWidth;

  const handleFileContentChange = useCallback(
    (content: string | undefined) => {
      if (!activeMonacoTabName || !content) return;

      if (activeMonacoTabName === "setup.ts") {
        store.setSetupCode(content);
      } else if (activeMonacoTabName === "README.md") {
        store.setReadmeContent(content);
      } else {
        store.updateImplementation(activeMonacoTabName, content);
      }
    },
    [activeMonacoTabName, store],
  );

  return (
    <div className="flex flex-col h-screen">
      {/* top bar */}
      <EditorTopBar />

      <ResizablePanelGroup className="flex w-full h-full" direction="horizontal">
        <ResizablePanel
          className={cn("flex", `min-w-[${MIN_SIDEBAR_WIDTH}px]`)}
          defaultSize={defaultSidebarSize}
        >
          {/* sidebar */}
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

          {/* sidebar panel */}
          {activeTab === "code" && (
            <div className="flex-1 px-1 h-full text-sm bg-zinc-100">
              <div className="p-2 font-medium uppercase">Code</div>
              <FileTree
                activeFile={activeMonacoTabName || undefined}
                item={root}
                level={0}
                onFileClick={(item) => openMonacoTab(item.name)}
              />
            </div>
          )}
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel>
          {/* code */}
          {activeTab === "code" && (
            <CodeView
              activeFile={activeMonacoTabName}
              tabs={monacoTabs}
              onChangeTab={changeMonacoTab}
              onCloseTab={closeMonacoTab}
              onContentChange={handleFileContentChange}
              onSetTabs={setMonacoTabs}
            />
          )}

          {activeTab === "results" && <div className="p-4">results</div>}
          {activeTab === "environment" && <div className="p-4">environment</div>}
          {activeTab === "settings" && <div className="p-4">settings</div>}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
