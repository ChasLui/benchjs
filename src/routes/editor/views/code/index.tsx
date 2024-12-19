import { useCallback } from "react";
import { useBenchmarkStore } from "@/stores/benchmarkStore";
import { useMonacoTabs } from "@/hooks/useMonacoTabs";
import { Monaco } from "@/components/common/Monaco";
import { RunPanel } from "@/components/editor/RunPanel";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

interface CodeViewProps {
  monacoTabs: ReturnType<typeof useMonacoTabs>;
}

export const CodeView = ({ monacoTabs }: CodeViewProps) => {
  const store = useBenchmarkStore();

  const getFileContent = (filename: string) => {
    if (filename === "README.md") return store.readmeContent;
    if (filename === "setup.ts") return store.setupCode;
    return store.implementations.find((i) => i.filename === filename)?.content || "";
  };

  const handleFileContentChange = useCallback(
    (content: string | undefined) => {
      if (!monacoTabs.activeTabName || !content) return;

      if (monacoTabs.activeTabName === "setup.ts") {
        store.setSetupCode(content);
      } else if (monacoTabs.activeTabName === "README.md") {
        store.setReadmeContent(content);
      } else {
        store.updateImplementation(monacoTabs.activeTabName, content);
      }
    },
    [monacoTabs.activeTabName, store],
  );

  return (
    <ResizablePanelGroup className="h-full" direction="vertical">
      <ResizablePanel defaultSize={80}>
        <Monaco
          key={monacoTabs.activeTabName}
          language={monacoTabs.activeTabName?.endsWith(".md") ? "markdown" : "typescript"}
          tabs={monacoTabs.tabs}
          value={getFileContent(monacoTabs.activeTabName ?? "")}
          onChange={handleFileContentChange}
          onChangeTab={monacoTabs.changeTab}
          onCloseTab={monacoTabs.closeTab}
          onSetTabs={monacoTabs.setTabs}
        />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={35}>
        <RunPanel />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
