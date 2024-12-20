import { Loader2Icon, PauseIcon, PlayIcon, RotateCcwIcon } from "lucide-react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BenchmarkRun } from "@/stores/benchmarkStore";
import { formatCount, formatTime } from "@/lib/formatters";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ChartDataPoint {
  time: number;
  duration: number;
  memory: number;
  cpu: number;
}

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
  const iterationsLabel = `${formatCount(iterationsCompleted)} / ${formatCount(totalIterations)}`;

  const elapsedTime = latestRun?.elapsedTime ?? 0;
  const averageTime = latestRun?.result?.stats.time.average ?? 0;
  const formattedAverageTime =
    isRunning && iterationsCompleted > 0
      ? formatTime(elapsedTime / iterationsCompleted)
      : formatTime(averageTime);

  const stats = latestRun?.result?.stats;
  const peakMemory = 0;

  // mock data for the chart
  const chartData: ChartDataPoint[] = Array.from({ length: 20 }, (_, i) => ({
    time: i * 100,
    duration: Math.random() * 10,
    memory: Math.random() * 100,
    cpu: Math.random() * 100,
  }));

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center space-x-2">
        <Button className="px-2" disabled={isRunning} onClick={onRun}>
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
            <CardTitle className="font-medium">Benchmark Progress</CardTitle>
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
                  Samples: <span className="font-medium">{iterationsLabel}</span>
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

      {stats && (
        <Card>
          <CardHeader>
            <CardTitle className="font-medium">Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Samples</p>
                <p className="text-lg font-semibold">{formatCount(stats.samples)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Batches</p>
                <p className="text-lg font-semibold">{formatCount(stats.batches)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Time</p>
                <p className="text-lg font-semibold">{formatTime(stats.time.total)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Average Time</p>
                <p className="text-lg font-semibold">{formatTime(stats.time.average)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Min Time</p>
                <p className="text-lg font-semibold">{formatTime(stats.time.min)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Max Time</p>
                <p className="text-lg font-semibold">{formatTime(stats.time.max)}</p>
              </div>
            </div>
            <div className="pt-4 mt-4 border-t">
              <h4 className="mb-2 font-medium">Operations per Second</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Average ops/sec</p>
                  <p className="text-lg font-semibold">
                    {formatCount(Math.round(stats.opsPerSecond.average))}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Min ops/sec</p>
                  <p className="text-lg font-semibold">{formatCount(Math.round(stats.opsPerSecond.min))}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Max ops/sec</p>
                  <p className="text-lg font-semibold">{formatCount(Math.round(stats.opsPerSecond.max))}</p>
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
          <div className="h-[200px]">
            <ResponsiveContainer height="100%" width="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" tickFormatter={(value: number) => `${(value / 1000).toFixed(1)}s`} />
                <YAxis yAxisId="left" />
                <YAxis orientation="right" yAxisId="right" />
                <Tooltip
                  formatter={(value: number, name: string) => {
                    const items: string[] = [];
                    if (name === "memory") {
                      items.push(`Memory ${value.toFixed(2)}MB`);
                    } else if (name === "cpu") {
                      items.push(`CPU ${value.toFixed(2)}%`);
                    } else {
                      items.push(`Iterations ${(Number(value) / 1000).toFixed(1)}s`);
                    }
                    return items;
                  }}
                  labelFormatter={(value: number) => `Time: ${(Number(value) / 1000).toFixed(1)}s`}
                />
                <Legend />
                <Line
                  dataKey="duration"
                  dot={false}
                  name="Iteration Duration"
                  stroke="#2563eb"
                  type="monotone"
                  yAxisId="left"
                />
                <Line
                  dataKey="memory"
                  dot={false}
                  name="Memory Usage"
                  stroke="#16a34a"
                  type="monotone"
                  yAxisId="right"
                />
                <Line
                  dataKey="cpu"
                  dot={false}
                  name="CPU Usage"
                  stroke="#dc2626"
                  type="monotone"
                  yAxisId="right"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
