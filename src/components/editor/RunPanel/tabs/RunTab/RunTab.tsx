import {
  ActivityIcon,
  AlertCircleIcon,
  ClockIcon,
  HashIcon,
  PauseIcon,
  PlayIcon,
  RotateCcwIcon,
  ZapIcon,
} from "lucide-react";
import { formatTime } from "@/lib/formatters";
import { MetricCard } from "@/components/common/MetricCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface RunTabProps {
  isRunning: boolean;
  progress: number;
  elapsedTime: number;
  iterationsCompleted: number;
  totalIterations: number;
  averageTime: number;
  peakMemory: number;
  error: string | null;
  onRun?: () => void;
  onPause?: () => void;
  onReset?: () => void;
}

export const RunTab = ({
  isRunning,
  progress,
  elapsedTime,
  iterationsCompleted,
  totalIterations,
  averageTime,
  peakMemory,
  error,
  onRun,
  onPause,
  onReset,
}: RunTabProps) => {
  const formattedPeakMemory = `${peakMemory.toFixed(1)} N/A`;
  const formattedAverageTime = averageTime ? `${averageTime.toFixed(2)}ms` : "N/A";
  const formattedIterations = totalIterations ? `${iterationsCompleted} / ${totalIterations}` : "N/A";

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center space-x-2">
        <Button className="px-2.5" disabled={isRunning} onClick={onRun}>
          <PlayIcon className="mr-2 w-4 h-4" />
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
              <AlertCircleIcon className="w-4 h-4" />
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {(isRunning || progress > 0) && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{progress.toFixed(1)}%</span>
              </div>
              <Progress className="h-2" value={progress} />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-4">
        <MetricCard icon={ClockIcon} title="Elapsed Time" value={formatTime(elapsedTime)} />
        <MetricCard icon={HashIcon} title="Iterations" value={formattedIterations} />
        <MetricCard icon={ActivityIcon} title="Average Time" value={formattedAverageTime} />
        <MetricCard icon={ZapIcon} title="Peak Memory" value={formattedPeakMemory} />
      </div>

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
