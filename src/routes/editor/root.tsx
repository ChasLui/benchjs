import { useMemo, useState } from "react";
import { nanoid } from "nanoid";
import { usePersistentStore } from "@/stores/persistentStore";
import { useMonacoTabs } from "@/hooks/useMonacoTabs";
import { DEFAULT_IMPLEMENTATION } from "@/constants";
import { cn } from "@/lib/utils";
import { CodeView } from "@/routes/editor/views/code/index";
import { FileTree, FileTreeItem } from "@/components/common/FileTree";
import { Sidebar, SidebarTab } from "@/components/editor/Sidebar";
import { TopBar } from "@/components/editor/TopBar";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

const MIN_SIDEBAR_WIDTH = 280;

export default function EditorRoute() {
  const store = usePersistentStore();
  const monacoTabs = useMonacoTabs(store.implementations, {
    initialActiveTabId: store.activeTabId,
    onTabChange: (tabId: string | null) => {
      store.setActiveTabId(tabId);
    },
  });
  const [activeTab, setActiveTab] = useState<SidebarTab>("code");

  const root = useMemo<FileTreeItem>(() => {
    return {
      id: "root",
      name: "root",
      type: "root",
      children: [
        {
          id: "implementations",
          name: "implementations",
          type: "folder",
          children: store.implementations.map((item) => ({
            id: item.id,
            name: item.filename,
            type: "file",
            actions: {
              onRename: (newName: string) => {
                const trimmedName = newName.trim();
                const isDuplicate = store.implementations.some(
                  (otherItem) =>
                    otherItem.id !== item.id &&
                    otherItem.filename.toLowerCase() === trimmedName.toLowerCase(),
                );

                if (isDuplicate) {
                  throw new Error("An implementation with this name already exists");
                }

                store.renameImplementation(item.id, trimmedName);
              },
              onDelete: () => {
                store.removeImplementation(item.id);
              },
            },
          })),
          actions: {
            onCreate: () => {
              const filename = `implementation-${store.implementations.length + 1}.ts`;
              const id = nanoid();
              console.log("create", id, filename);
              store.addImplementation({
                id,
                filename,
                content: DEFAULT_IMPLEMENTATION,
              });
              monacoTabs.openTab({ id, name: filename, active: true });
            },
          },
        },
        {
          id: "setup.ts",
          name: "setup.ts",
          type: "file",
        },
        {
          id: "README.md",
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
                activeFileId={monacoTabs.activeTabId || undefined}
                item={root}
                level={0}
                onFileClick={(item) => {
                  return monacoTabs.openTab({
                    id: item.id,
                    name: item.name,
                    active: true,
                  });
                }}
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
