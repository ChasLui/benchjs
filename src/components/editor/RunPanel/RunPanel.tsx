import { useState } from "react";
import { RunTab } from "@/components/editor/RunPanel/tabs/RunTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type RunPanelTab = "console" | "run";

const benchmarkConfig = {
  iterations: 1000,
};

interface RunPanelProps {}

export const RunPanel = ({}: RunPanelProps) => {
  const [activeTab, setActiveTab] = useState<RunPanelTab>("run");

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

  const handleRun = () => {
    setIsRunning(true);
    setProgress(0);
    setElapsedTime(0);
    setIterationsCompleted(0);
    setAverageTime(0);
    setPeakMemory(0);
    setError(null);

    const startTime = Date.now();
    const interval = setInterval(() => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      setElapsedTime(elapsed);

      const newIterations = Math.floor((elapsed / 1000) * 50); // Increased speed for demo
      const completedIterations = Math.min(newIterations, benchmarkConfig.iterations);
      setIterationsCompleted(completedIterations);
      setProgress(Math.min((completedIterations / benchmarkConfig.iterations) * 100, 100));

      const currentAverage = elapsed / (completedIterations || 1);
      setAverageTime(currentAverage);

      const memory = Math.random() * 100 + 50; // Simulated memory usage
      setPeakMemory((prevPeakMemory) => Math.max(prevPeakMemory, memory));

      if (completedIterations >= benchmarkConfig.iterations) {
        clearInterval(interval);
        setIsRunning(false);
      }
    }, 100);
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
