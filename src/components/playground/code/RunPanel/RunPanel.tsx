import { useEffect, useState } from "react";
import { FlameIcon, Loader2Icon, SquareChevronRightIcon } from "lucide-react";
import { useShallow } from "zustand/shallow";
import { useLatestRunForImplementation } from "@/stores/benchmarkStore";
import { useBenchmarkStore } from "@/stores/benchmarkStore";
import { Implementation } from "@/stores/persistentStore";
import { RunTab } from "@/components/playground/code/RunPanel/tabs/RunTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConsoleTab } from "./tabs/ConsoleTab";

type RunPanelTab = "console" | "run";

interface RunPanelProps {
  implementation: Implementation;
  onRun?: () => void;
  onStop?: () => void;
}

export const RunPanel = ({ implementation, onRun, onStop }: RunPanelProps) => {
  const latestRun = useLatestRunForImplementation(implementation.id);
  const chartData = useBenchmarkStore(
    useShallow((state) => (latestRun ? state.chartData[latestRun.id] || [] : [])),
  );
  const { clearChartData } = useBenchmarkStore(
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

  useEffect(() => {
    if (!latestRun || ["cancelled", "completed", "failed"].includes(latestRun.status)) {
      setIsRunning(false);
    }
  }, [latestRun]);

  return (
    <Tabs className="flex flex-col h-full" value={activeTab} onValueChange={handleSetTab}>
      <TabsList className="justify-start p-0 w-full h-auto bg-gray-50 rounded-none border-b">
        <TabsTrigger
          className="data-[state=active]:bg-white px-4 rounded-none border-r py-1.5 flex items-center gap-1"
          value="run"
        >
          <FlameIcon className="w-4 h-4" />
          <span>Run</span>
        </TabsTrigger>
        <TabsTrigger
          className="data-[state=active]:bg-white px-4 rounded-none border-r py-1.5 flex items-center gap-1"
          value="console"
        >
          <SquareChevronRightIcon className="w-4 h-4" />
          <span>Console</span>
        </TabsTrigger>
        {isRunning && (
          <div className="flex gap-1 items-center px-2 ml-auto">
            <Loader2Icon className="w-4 h-4 animate-spin" />
            <span className="text-xs text-muted-foreground">Running...</span>
          </div>
        )}
      </TabsList>

      <div className="overflow-auto flex-1">
        <TabsContent className="m-0" value="run">
          <RunTab
            chartData={chartData}
            clearChartData={clearChartData}
            isRunning={isRunning}
            latestRun={latestRun}
            onRun={handleRun}
            onStop={onStop}
          />
        </TabsContent>

        <TabsContent className="m-0" value="console">
          <ConsoleTab logs={consoleLogs} />
        </TabsContent>
      </div>
    </Tabs>
  );
};
