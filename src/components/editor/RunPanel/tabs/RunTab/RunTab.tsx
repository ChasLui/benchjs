import { useCallback, useEffect } from "react";
import { Loader2Icon, PauseIcon, PlayIcon, RotateCcwIcon, TriangleAlertIcon } from "lucide-react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { BenchmarkRun, ChartDataPoint } from "@/stores/benchmarkStore";
import { formatCount, formatCountShort, formatTime } from "@/lib/formatters";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface RunTabProps {
  isRunning: boolean;
  latestRun?: BenchmarkRun;
  onRun?: () => void;
  onPause?: () => void;
  onReset?: () => void;
  chartData: ChartDataPoint[];
  addChartPoint: (runId: string, point: ChartDataPoint) => void;
  clearChartData: (runId: string) => void;
}

export const RunTab = ({
  isRunning,
  latestRun,
  onRun,
  onPause,
  onReset,
  chartData,
  addChartPoint,
  clearChartData,
}: RunTabProps) => {
  const progress = latestRun?.progress ?? 0;
  const error = latestRun?.error ?? null;

  const iterationsCompleted = latestRun?.iterations ?? 0;
  const totalIterations = latestRun?.totalIterations ?? 1000;
  const iterationsLabel = `${formatCount(iterationsCompleted)}/${formatCount(totalIterations)}`;

  const elapsedTime = latestRun?.result?.stats.time.total ?? latestRun?.elapsedTime ?? 0;
  const averageTime = latestRun?.result?.stats.time.average ?? 0;
  const formattedAverageTime =
    isRunning && iterationsCompleted > 0
      ? formatTime(elapsedTime / iterationsCompleted)
      : formatTime(averageTime);

  const stats = latestRun?.result?.stats;
  const peakMemory = 0;

  const handleRun = useCallback(() => {
    if (latestRun) clearChartData(latestRun.id);
    onRun?.();
  }, [clearChartData, latestRun, onRun]);

  useEffect(() => {
    if (latestRun?.status !== "running") return;
    if (latestRun.iterations === 0) return;
    const timePerOp = latestRun.iterations > 0 ? latestRun.elapsedTime / latestRun.iterations : 0;
    addChartPoint(latestRun.id, {
      time: latestRun.elapsedTime,
      timePerOp,
      iterations: latestRun.iterations,
    });
  }, [addChartPoint, latestRun]);

  return (
    <div className="p-4 pb-6 space-y-4 max-w-[1024px]">
      {/* actions */}
      <div className="flex items-center space-x-2">
        <Button className="px-2" disabled={isRunning} onClick={handleRun}>
          {isRunning && <Loader2Icon className="w-4 h-4 animate-spin" />}
          {!isRunning && <PlayIcon className="w-4 h-4" />}

          {!isRunning && "Run Benchmark"}
          {isRunning && latestRun?.status === "idle" && "Preparing..."}
          {isRunning && latestRun?.status === "warmup" && "Warming up..."}
          {isRunning && latestRun?.status === "running" && "Running..."}
        </Button>
        <Button disabled={!isRunning} variant="outline" onClick={onPause}>
          <PauseIcon className="w-4 h-4" />
        </Button>
        <Button disabled={isRunning} variant="outline" onClick={onReset}>
          <RotateCcwIcon className="w-4 h-4" />
        </Button>
      </div>

      {/* error */}
      {error && (
        <Card className="bg-red-50 border-red-500">
          <CardContent className="py-2 px-4">
            <div className="flex gap-2.5 items-start text-sm text-red-500">
              <TriangleAlertIcon className="w-8 h-8" />
              <div className="flex flex-col flex-1 justify-center">
                <p>Error: {error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="p-4 rounded-lg border shadow-sm bg-muted border-zinc-200">
        <h3 className="mb-2 font-medium">Overview</h3>
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
              Elapsed Time: <span className="font-mono font-medium">{formatTime(elapsedTime)}</span>
            </div>
            <div>
              Samples: <span className="font-mono font-medium">{iterationsLabel}</span>
            </div>
            <div>
              Average Time: <span className="font-mono font-medium">{formattedAverageTime}</span>
            </div>
            <div>
              Peak Memory: <span className="font-mono font-medium">{peakMemory.toFixed(1)} MB</span>
            </div>
          </div>
        </div>
      </div>

      {stats && (
        <div className="p-4 rounded-lg border shadow-sm bg-muted border-zinc-200">
          <h3 className="mb-2 font-medium">Stats</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Samples</p>
              <p className="font-mono font-semibold">{formatCount(stats.samples)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Batches</p>
              <p className="font-mono font-semibold">{formatCount(stats.batches)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Time</p>
              <p className="font-mono font-semibold">{formatTime(stats.time.total)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Average Time</p>
              <p className="font-mono font-semibold">{formatTime(stats.time.average)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Min Time</p>
              <p className="font-mono font-semibold">{formatTime(stats.time.min)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Max Time</p>
              <p className="font-mono font-semibold">{formatTime(stats.time.max)}</p>
            </div>
          </div>
          <div className="pt-4 mt-4 border-t">
            <h4 className="mb-2 font-medium">Percentiles</h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">50th Percentile</p>
                <p className="font-mono font-semibold">{formatTime(10)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">90th Percentile</p>
                <p className="font-mono font-semibold">{formatTime(13)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">95th Percentile</p>
                <p className="font-mono font-semibold">{formatTime(14)}</p>
              </div>
            </div>
          </div>
          <div className="pt-4 mt-4 border-t">
            <h4 className="mb-2 font-medium">Ops/Second</h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Average ops/sec</p>
                <p className="font-mono text-lg font-semibold">
                  {formatCount(Math.round(stats.opsPerSecond.average))}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Min ops/sec</p>
                <p className="font-mono text-lg font-semibold">
                  {formatCount(Math.round(stats.opsPerSecond.min))}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Max ops/sec</p>
                <p className="font-mono text-lg font-semibold">
                  {formatCount(Math.round(stats.opsPerSecond.max))}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 rounded-lg border shadow-sm bg-muted border-zinc-200">
        <h3 className="mb-2 font-medium">Real-time Performance</h3>
        <div className="h-[200px]">
          <ResponsiveContainer height="100%" width="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 30, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" tickFormatter={(value: number) => `${(value / 1000).toFixed(1)}s`} />
              <YAxis tickFormatter={formatTime} width={60} yAxisId="left" />
              <YAxis orientation="right" tickFormatter={formatCountShort} width={60} yAxisId="right" />
              <Tooltip
                formatter={(value: number, name: string) => {
                  if (name === "Total Samples") return [formatCount(value), name];
                  return [formatTime(value), name];
                }}
                labelFormatter={(value) => `Time: ${(value / 1000).toFixed(1)}s`}
              />
              <Legend wrapperStyle={{ paddingTop: 5, fontSize: 14 }} />
              <Line
                dataKey="timePerOp"
                dot={false}
                isAnimationActive={false}
                name="Time per Operation"
                stroke="#2563eb"
                type="monotone"
                yAxisId="left"
              />
              <Line
                dataKey="iterations"
                dot={false}
                isAnimationActive={false}
                name="Total Samples"
                stroke="#16a34a"
                type="monotone"
                yAxisId="right"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
