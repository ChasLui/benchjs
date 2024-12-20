import { useEffect, useState } from "react";
import { useLatestRunForImplementation } from "@/stores/benchmarkStore";
import { Implementation } from "@/stores/persistentStore";
import { RunTab } from "@/components/editor/RunPanel/tabs/RunTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type RunPanelTab = "console" | "run";

interface RunPanelProps {
  implementation: Implementation;
  onRun?: () => void;
}

export const RunPanel = ({ implementation, onRun }: RunPanelProps) => {
  const [activeTab, setActiveTab] = useState<RunPanelTab>("run");

  const latestRun = useLatestRunForImplementation(implementation.id);
  const [isRunning, setIsRunning] = useState(latestRun?.status === "running");

  const handleSetTab = (tab: string) => {
    setActiveTab(tab as RunPanelTab);
  };

  const handleRun = async () => {
    setIsRunning(true);
    onRun?.();
  };

  // remove
  const handlePause = () => {};
  const handleReset = () => {};

  const progress = latestRun?.progress ?? 0;
  const error = latestRun?.error ?? null;

  useEffect(() => {
    if (!latestRun || ["completed", "failed"].includes(latestRun.status)) {
      setIsRunning(false);
    }
  }, [latestRun]);

  return (
    <Tabs className="flex flex-col h-full" value={activeTab} onValueChange={handleSetTab}>
      <TabsList className="justify-start p-0 w-full h-auto bg-gray-50 rounded-none border-b">
        <TabsTrigger className="data-[state=active]:bg-white rounded-none border-r py-1.5" value="run">
          Run
        </TabsTrigger>
        <TabsTrigger className="data-[state=active]:bg-white rounded-none border-r py-1.5" value="results">
          Console
        </TabsTrigger>
      </TabsList>

      <div className="overflow-auto flex-1">
        <TabsContent className="m-0" value="run">
          <RunTab
            averageTime={latestRun?.result?.stats.time.average ?? 0}
            elapsedTime={latestRun?.elapsedTime ?? 0}
            error={error}
            isRunning={isRunning}
            iterationsCompleted={latestRun?.iterations ?? 0}
            peakMemory={0}
            progress={progress}
            totalIterations={latestRun?.iterations ?? 0}
            onPause={handlePause}
            onReset={handleReset}
            onRun={handleRun}
          />
        </TabsContent>

        <TabsContent value="console">console</TabsContent>
      </div>
    </Tabs>
  );
};
