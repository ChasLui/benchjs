import { useBenchmarkStore } from "@/stores/benchmarkStore";
import { Monaco } from "@/components/common/Monaco";
import { MonacoTab } from "@/components/common/MonacoTab";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

interface CodeViewProps {
  activeFile?: string;
  tabs: MonacoTab[];
  onChangeTab: (tab: MonacoTab) => void;
  onCloseTab: (tab: MonacoTab) => void;
  onContentChange: (content: string | undefined) => void;
  onSetTabs: (tabs: MonacoTab[]) => void;
}

export const CodeView = ({
  activeFile,
  tabs,
  onChangeTab,
  onCloseTab,
  onContentChange,
  onSetTabs,
}: CodeViewProps) => {
  const store = useBenchmarkStore();

  const getFileContent = (filename: string) => {
    if (filename === "README.md") return store.readmeContent;
    if (filename === "setup.ts") return store.setupCode;
    return store.implementations.find((i) => i.filename === filename)?.content || "";
  };

  return (
    <ResizablePanelGroup className="h-full" direction="vertical">
      <ResizablePanel defaultSize={80}>
        <Monaco
          key={activeFile}
          language={activeFile?.endsWith(".md") ? "markdown" : "typescript"}
          tabs={tabs}
          value={getFileContent(activeFile ?? "")}
          onChange={onContentChange}
          onChangeTab={onChangeTab}
          onCloseTab={onCloseTab}
          onSetTabs={onSetTabs}
        />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={20}>
        {/* run */}
        run panel
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
