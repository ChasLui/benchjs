import { useEffect, useState } from "react";
import { Columns2Icon, FlameIcon, Loader2Icon, Rows2Icon, SquareChevronRightIcon } from "lucide-react";
import { useShallow } from "zustand/shallow";
import { useLatestRunForImplementation } from "@/stores/benchmarkStore";
import { useBenchmarkStore } from "@/stores/benchmarkStore";
import { Implementation } from "@/stores/persistentStore";
import { RunTab } from "@/components/playground/code/RunPanel/tabs/RunTab";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConsoleTab } from "./tabs/ConsoleTab";

type RunPanelTab = "console" | "run";

interface RunPanelProps {
  implementation: Implementation;
  onRun?: () => void;
  onStop?: () => void;
  layout?: "horizontal" | "vertical";
  onLayoutChange?: () => void;
}

export const RunPanel = ({ implementation, onRun, onStop, layout, onLayoutChange }: RunPanelProps) => {
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
      <TabsList className="justify-start p-0 w-full h-auto rounded-none border-b bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800">
        <TabsTrigger
          className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 px-4 rounded-none border-r dark:border-zinc-800 py-1.5 flex items-center gap-1"
          value="run"
        >
          <FlameIcon className="w-4 h-4" />
          <span>Run</span>
        </TabsTrigger>
        <TabsTrigger
          className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 px-4 rounded-none border-r dark:border-zinc-800 py-1.5 flex items-center gap-1"
          value="console"
        >
          <SquareChevronRightIcon className="w-4 h-4" />
          <span>Console</span>
        </TabsTrigger>
        <div className="flex gap-2 items-center px-2 ml-auto">
          {isRunning && (
            <>
              <Loader2Icon className="w-4 h-4 animate-spin" />
              <span className="text-xs text-muted-foreground">Running...</span>
            </>
          )}
          {onLayoutChange && (
            <Button className="w-8 h-8" size="icon" variant="ghost" onClick={onLayoutChange}>
              {layout === "horizontal" ?
                <Columns2Icon className="w-4 h-4" />
              : <Rows2Icon className="w-4 h-4" />}
            </Button>
          )}
        </div>
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
