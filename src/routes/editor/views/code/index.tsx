import { useCallback, useMemo } from "react";
import { usePersistentStore } from "@/stores/persistentStore";
import { useMonacoTabs } from "@/hooks/useMonacoTabs";
import { Monaco } from "@/components/common/Monaco";
import { RunPanel } from "@/components/editor/RunPanel";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

interface CodeViewProps {
  monacoTabs: ReturnType<typeof useMonacoTabs>;
}

export const CodeView = ({ monacoTabs }: CodeViewProps) => {
  const store = usePersistentStore();

  const currentImplementation = useMemo(() => {
    return store.implementations.find((item) => item.id === monacoTabs.activeTabId);
  }, [monacoTabs.activeTabId, store]);

  const getFileContent = (id: string) => {
    if (id === "README.md") return store.readmeContent;
    if (id === "setup.ts") return store.setupCode;
    return store.implementations.find((item) => item.id === id)?.content || "";
  };

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

  return (
    <ResizablePanelGroup className="h-full" direction="vertical">
      <ResizablePanel defaultSize={80}>
        <Monaco
          key={monacoTabs.activeTabId}
          language={monacoTabs.activeTabId?.endsWith(".md") ? "markdown" : "typescript"}
          tabs={monacoTabs.tabs}
          value={getFileContent(monacoTabs.activeTabId ?? "")}
          onChange={handleFileContentChange}
          onChangeTab={monacoTabs.changeTab}
          onCloseTab={monacoTabs.closeTab}
          onSetTabs={monacoTabs.setTabs}
        />
      </ResizablePanel>
      {currentImplementation && (
        <>
          <ResizableHandle />
          <ResizablePanel defaultSize={35}>
            <RunPanel implementation={currentImplementation} />
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  );
};
