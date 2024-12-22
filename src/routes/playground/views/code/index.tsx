import { useCallback, useMemo } from "react";
import { nanoid } from "nanoid";
import { useLatestRunForImplementation } from "@/stores/benchmarkStore";
import { usePersistentStore } from "@/stores/persistentStore";
import { useMonacoTabs } from "@/hooks/useMonacoTabs";
import { DEFAULT_IMPLEMENTATION } from "@/constants";
import { cn } from "@/lib/utils";
import { benchmarkService } from "@/services/benchmark/benchmark-service";
import { FileTree, FileTreeItem } from "@/components/common/FileTree";
import { Monaco } from "@/components/common/Monaco";
import { RunPanel } from "@/components/playground/RunPanel";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

const MIN_SIDEBAR_WIDTH = 280;

interface CodeViewProps {
  monacoTabs: ReturnType<typeof useMonacoTabs>;
}

export const CodeView = ({ monacoTabs }: CodeViewProps) => {
  const store = usePersistentStore();

  const currentImplementation = useMemo(() => {
    return store.implementations.find((item) => item.id === monacoTabs.activeTabId);
  }, [monacoTabs.activeTabId, store]);

  const latestRun = useLatestRunForImplementation(currentImplementation?.id ?? "");

  const getFileContent = (id: string) => {
    if (id === "README.md") return store.readmeContent;
    if (id === "setup.ts") return store.setupCode;
    return store.implementations.find((item) => item.id === id)?.content || "";
  };

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
              const id = nanoid();
              const existingFilenames = new Set(store.implementations.map((i) => i.filename));
              let filename = `implementation-${store.implementations.length + 1}.ts`;
              let i = store.implementations.length + 1;
              while (existingFilenames.has(filename)) {
                filename = `implementation-${i++}.ts`;
              }
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

  const extraLibs = useMemo(() => {
    if (!currentImplementation) return [];
    return [
      {
        content: store.setupDTS,
      },
    ];
  }, [currentImplementation, store.setupDTS]);

  const handleFileContentChange = useCallback(
    (content: string | undefined) => {
      if (!monacoTabs.activeTabId || !content) return;

      if (monacoTabs.activeTabId === "setup.ts") {
        store.setSetupCode(content);
      } else if (monacoTabs.activeTabId === "README.md") {
        store.setReadmeContent(content);
      } else {
        store.updateImplementationCode(monacoTabs.activeTabId, content);
      }
    },
    [monacoTabs.activeTabId, store],
  );

  const handleSetupDTSChange = useCallback(
    (value: string) => {
      store.setSetupDTS(value);
    },
    [store],
  );

  const handleRun = useCallback(() => {
    if (!currentImplementation) return;
    benchmarkService.runBenchmark(store.setupCode, [currentImplementation]);
  }, [currentImplementation, store]);

  const handleStop = useCallback(() => {
    if (!latestRun) return;
    benchmarkService.stopBenchmark(latestRun.id);
  }, [latestRun]);

  const defaultSidebarSize = (MIN_SIDEBAR_WIDTH * 100) / window.innerWidth;

  return (
    <ResizablePanelGroup className="flex flex-1 w-full" direction="horizontal">
      <ResizablePanel className={cn("flex")} defaultSize={defaultSidebarSize}>
        {/* left - file tree */}
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
      </ResizablePanel>

      <ResizableHandle />

      <ResizablePanel>
        {/* right */}
        <ResizablePanelGroup autoSaveId="code" className="h-full" direction="vertical">
          <ResizablePanel defaultSize={80}>
            <Monaco
              key={monacoTabs.activeTabId}
              extraLibs={extraLibs}
              language={monacoTabs.activeTabId?.endsWith(".md") ? "markdown" : "typescript"}
              tabs={monacoTabs.tabs}
              value={getFileContent(monacoTabs.activeTabId ?? "")}
              onChange={handleFileContentChange}
              onChangeTab={monacoTabs.changeTab}
              onCloseOtherTabs={monacoTabs.closeOtherTabs}
              onCloseTab={monacoTabs.closeTab}
              onCloseTabsToLeft={monacoTabs.closeTabsToLeft}
              onCloseTabsToRight={monacoTabs.closeTabsToRight}
              onDTSChange={monacoTabs.activeTabId === "setup.ts" ? handleSetupDTSChange : undefined}
              onSetTabs={monacoTabs.setTabs}
            />
          </ResizablePanel>
          {currentImplementation && (
            <>
              <ResizableHandle />
              <ResizablePanel defaultSize={35}>
                <RunPanel implementation={currentImplementation} onRun={handleRun} onStop={handleStop} />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
