import { Loader2Icon, PauseIcon, PlayIcon, RotateCcwIcon } from "lucide-react";
import { BenchmarkRun } from "@/stores/benchmarkStore";
import { formatTime } from "@/lib/formatters";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface RunTabProps {
  isRunning: boolean;
  latestRun?: BenchmarkRun;
  onRun?: () => void;
  onPause?: () => void;
  onReset?: () => void;
}

export const RunTab = ({ isRunning, latestRun, onRun, onPause, onReset }: RunTabProps) => {
  const progress = latestRun?.progress ?? 0;
  const error = latestRun?.error ?? null;

  const iterationsCompleted = latestRun?.iterations ?? 0;
  const totalIterations = latestRun?.totalIterations ?? 1000;
  const iterationsLabel = `${iterationsCompleted} / ${totalIterations}`;

  const elapsedTime = latestRun?.elapsedTime ?? 0;
  const averageTime = latestRun?.result?.stats.time.average ?? 0;
  const formattedAverageTime = isRunning && iterationsCompleted > 0
    ? formatTime(elapsedTime / iterationsCompleted)
    : formatTime(averageTime);

  const peakMemory = 0;

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center space-x-2">
        <Button className="px-2.5" disabled={isRunning} onClick={onRun}>
          {isRunning && <Loader2Icon className="w-4 h-4 animate-spin" />}
          {!isRunning && <PlayIcon className="w-4 h-4" />}
          {isRunning ? "Running..." : "Run Benchmark"}
        </Button>
        <Button disabled={!isRunning} variant="outline" onClick={onPause}>
          <PauseIcon className="w-4 h-4" />
        </Button>
        <Button disabled={isRunning} variant="outline" onClick={onReset}>
          <RotateCcwIcon className="w-4 h-4" />
        </Button>
      </div>

      {error && (
        <Card className="border-red-500">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-red-500">
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {(isRunning || progress > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Benchmark Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{progress.toFixed(1)}%</span>
                </div>
                <Progress className="h-2" value={progress} />
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  Elapsed Time: <span className="font-medium">{formatTime(elapsedTime)}</span>
                </div>
                <div>
                  Iterations: <span className="font-medium">{iterationsLabel}</span>
                </div>
                <div>
                  Average Time: <span className="font-medium">{formattedAverageTime}</span>
                </div>
                <div>
                  Peak Memory: <span className="font-medium">{peakMemory.toFixed(1)} MB</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Real-time Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">chart</div>
        </CardContent>
      </Card>
    </div>
  );
};
