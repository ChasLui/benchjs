import type { Meta, StoryObj } from "@storybook/react";
import { BenchmarkStatus } from "@/stores/benchmarkStore";
import { ComparisonTable } from "./ComparisonTable";

const meta = {
  title: "Playground/Compare/ComparisonTable",
  component: ComparisonTable,
} satisfies Meta<typeof ComparisonTable>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockImplementations = [
  {
    id: "1",
    filename: "implementation1.ts",
    content: 'console.log("test")',
    selected: false,
  },
  {
    id: "2",
    filename: "implementation2.ts",
    content: 'console.log("test2")',
    selected: true,
  },
];

const now = Date.now();

const mockRuns = {
  "1": [
    {
      id: "run1",
      implementationId: "1",
      status: "completed" as BenchmarkStatus,
      filename: "implementation1.ts",
      originalCode: 'console.log("test")',
      processedCode: 'console.log("test")',
      elapsedTime: 1000,
      completedIterations: 1000,
      totalIterations: 1000,
      progress: 100,
      createdAt: now,
      warmupStartedAt: now + 100,
      warmupEndedAt: now + 200,
      error: null,
      result: {
        name: "implementation1.ts",
        stats: {
          samples: 100,
          batches: 10,
          time: {
            total: 1000,
            min: 900,
            max: 1100,
            average: 1000,
            percentile50: 1000,
            percentile90: 1050,
            percentile95: 1075,
          },
          opsPerSecond: {
            average: 1000,
            max: 1100,
            min: 900,
            margin: 50,
          },
          memory: 1024,
        },
      },
    },
  ],
  "2": [
    {
      id: "run2",
      implementationId: "2",
      status: "running" as BenchmarkStatus,
      filename: "implementation2.ts",
      originalCode: 'console.log("test2")',
      processedCode: 'console.log("test2")',
      elapsedTime: 500,
      completedIterations: 500,
      totalIterations: 1000,
      progress: 50,
      createdAt: now,
      warmupStartedAt: now + 100,
      warmupEndedAt: null,
      error: null,
      result: {
        name: "implementation2.ts",
        stats: {
          samples: 50,
          batches: 5,
          time: {
            total: 500,
            min: 450,
            max: 550,
            average: 500,
            percentile50: 500,
            percentile90: 525,
            percentile95: 537,
          },
          opsPerSecond: {
            average: 500,
            max: 550,
            min: 450,
            margin: 25,
          },
          memory: 512,
        },
      },
    },
  ],
};

export const Default: Story = {
  args: {
    implementations: mockImplementations,
    runs: mockRuns,
    isRunning: true,
    onSelectAll: () => {},
    onToggleSelect: () => {},
    onRunSingle: () => {},
    onStop: () => {},
  },
};
