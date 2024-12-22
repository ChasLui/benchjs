import { useMemo } from "react";
import {
  Bar,
  CartesianGrid,
  Legend,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BenchmarkRun } from "@/stores/benchmarkStore";
import { Implementation } from "@/stores/persistentStore";
import { formatCountShort } from "@/lib/formatters";

interface ComparisonChartProps {
  implementations: Implementation[];
  runs: Record<string, BenchmarkRun[]>;
}

export const ComparisonChart = ({ implementations, runs }: ComparisonChartProps) => {
  const barData = useMemo(() => {
    return implementations.map((item) => {
      const run = runs[item.id]?.at(-1);
      const isRunning = run?.status === "running" || run?.status === "warmup";
      const opsPerSec =
        isRunning && run.completedIterations ?
          run.completedIterations / (run.elapsedTime / 1000)
        : run?.result?.stats.opsPerSecond.average || 0;

      return {
        name: item.filename,
        "Operations/sec": opsPerSec,
      };
    });
  }, [implementations, runs]);

  return (
    <div>
      <div>
        <ResponsiveContainer height={400} width="100%">
          <RechartsBarChart data={barData} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
            <CartesianGrid stroke="#eee" strokeDasharray="3 3" />
            <XAxis dataKey="name" height={30} interval={0} textAnchor="end" tick={{ fontSize: 12 }} />
            <YAxis
              label={{
                value: "Ops/sec",
                angle: -90,
                position: "left",
                style: {
                  textAnchor: "middle",
                },
              }}
              tick={{ fontSize: 12 }}
              tickFormatter={formatCountShort}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "12px",
              }}
              formatter={(value: number) => `${value.toLocaleString()} ops/sec`}
            />
            <Legend />
            <Bar dataKey="Operations/sec" fill="#2563eb" radius={[4, 4, 0, 0]} />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

