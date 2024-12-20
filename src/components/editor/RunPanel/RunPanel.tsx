import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";
import { useLatestRunForImplementation } from "@/stores/benchmarkStore";
import { useBenchmarkStore } from "@/stores/benchmarkStore";
import { Implementation } from "@/stores/persistentStore";
import { RunTab } from "@/components/editor/RunPanel/tabs/RunTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConsoleTab } from "./tabs/ConsoleTab";

type RunPanelTab = "console" | "run";

interface RunPanelProps {
  implementation: Implementation;
  onRun?: () => void;
}

export const RunPanel = ({ implementation, onRun }: RunPanelProps) => {
  const latestRun = useLatestRunForImplementation(implementation.id);
  const chartData = useBenchmarkStore(
    useShallow((state) => (latestRun ? state.chartData[latestRun.id] || [] : [])),
  );
  const { addChartPoint, clearChartData } = useBenchmarkStore(
    useShallow((state) => ({
      addChartPoint: state.addChartPoint,
      clearChartData: state.clearChartData,
    })),
  );
  const consoleLogs = useBenchmarkStore((state) => (latestRun ? state.consoleLogs[latestRun.id] : null));

  const [activeTab, setActiveTab] = useState<RunPanelTab>("run");
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
        <TabsTrigger className="data-[state=active]:bg-white rounded-none border-r py-1.5" value="console">
          Console
        </TabsTrigger>
      </TabsList>

      <div className="overflow-auto flex-1">
        <TabsContent className="m-0" value="run">
          <RunTab
            addChartPoint={addChartPoint}
            chartData={chartData}
            clearChartData={clearChartData}
            isRunning={isRunning}
            latestRun={latestRun}
            onPause={handlePause}
            onReset={handleReset}
            onRun={handleRun}
          />
        </TabsContent>

        <TabsContent className="m-0" value="console">
          <ConsoleTab logs={consoleLogs} />
        </TabsContent>
      </div>
    </Tabs>
  );
};
