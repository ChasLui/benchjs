import { useState } from "react";
import { useBenchmarkStore } from "@/stores/benchmarkStore";
import { BenchmarkService } from "@/services/benchmark/BenchmarkService";
import { BenchmateRunner } from "@/services/benchmark/BenchmateRunner";
import { RunTab } from "@/components/editor/RunPanel/tabs/RunTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type RunPanelTab = "console" | "run";

const benchmarkConfig = {
  iterations: 1000,
};

interface RunPanelProps {}

export const RunPanel = ({}: RunPanelProps) => {
  const [activeTab, setActiveTab] = useState<RunPanelTab>("run");
  const store = useBenchmarkStore();

  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [iterationsCompleted, setIterationsCompleted] = useState(0);
  const [averageTime, setAverageTime] = useState(0);
  const [peakMemory, setPeakMemory] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleSetTab = (tab: string) => {
    setActiveTab(tab as RunPanelTab);
  };

  const handleRun = async () => {
    console.log("handleRun called");
    console.log("Current store state:", {
      implementations: store.implementations,
      setupCode: store.setupCode,
    });

    if (store.implementations.length === 0) {
      setError("No implementations to benchmark");
      return;
    }

    setIsRunning(true);
    setProgress(0);
    setElapsedTime(0);
    setIterationsCompleted(0);
    setAverageTime(0);
    setPeakMemory(0);
    setError(null);

    const startTime = Date.now();

    try {
      console.log("Creating benchmark service");
      const service = new BenchmarkService(new BenchmateRunner());
      console.log("Running benchmark");
      const results = await service.runBenchmark(store.setupCode, store.implementations, {
        // iterations: benchmarkConfig.iterations,
      });

      // Update UI with results
      const totalTime = Date.now() - startTime;
      setElapsedTime(totalTime);

      if (results.length > 0) {
        const firstResult = results[0];
        setIterationsCompleted(firstResult.stats.samples);
        setAverageTime(firstResult.stats.time.average);
        setPeakMemory(firstResult.stats.opsPerSecond.average / 100);
      }

      setProgress(100);
      console.log("Benchmark results:", results);
    } catch (error_) {
      console.error("Benchmark error:", error_);
      const error = error_ instanceof Error ? error_ : new Error(String(error_));
      setError(error.message);
    } finally {
      setIsRunning(false);
    }
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setProgress(0);
    setElapsedTime(0);
    setIterationsCompleted(0);
    setAverageTime(0);
    setPeakMemory(0);
    setError(null);
  };

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
            averageTime={averageTime}
            elapsedTime={elapsedTime}
            error={error}
            isRunning={isRunning}
            iterationsCompleted={iterationsCompleted}
            peakMemory={peakMemory}
            progress={progress}
            totalIterations={benchmarkConfig.iterations}
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
