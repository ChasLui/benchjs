import type { Meta, StoryObj } from "@storybook/react";
import type { BenchmarkStatus } from "@/stores/benchmarkStore";
import { ShareDialog } from "./ShareDialog";

const mockImplementations = [
  { id: "1", filename: "quicksort.ts", content: "// implementation" },
  { id: "2", filename: "mergesort.ts", content: "// implementation" },
  { id: "3", filename: "bubblesort.ts", content: "// implementation" },
];

const createBenchmarkRun = (id: string, implId: string, filename: string, ops: number) => ({
  id,
  implementationId: implId,
  filename,
  originalCode: "// implementation",
  processedCode: "// processed implementation",
  status: "completed" as BenchmarkStatus,
  progress: 100,
  createdAt: Date.now(),
  warmupStartedAt: Date.now(),
  warmupEndedAt: Date.now(),
  runStartedAt: Date.now(),
  runEndedAt: Date.now(),
  elapsedTime: 1000,
  error: null,
  completedIterations: 1000,
  totalIterations: 1000,
  result: {
    name: filename,
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
        average: ops,
        max: ops * 1.1,
        min: ops * 0.9,
        margin: 0.01,
      },
    },
  },
});

const mockRuns = {
  "1": [createBenchmarkRun("run1", "1", "quicksort.ts", 15_000)],
  "2": [createBenchmarkRun("run2", "2", "mergesort.ts", 12_000)],
};

const meta = {
  title: "Playground/ShareDialog",
  component: ShareDialog,
  parameters: {
    layout: "centered",
  },
  args: {
    open: true,
    onOpenChange: () => {},
    shareUrl: "http://localhost:3000/#code=example",
  },
} satisfies Meta<typeof ShareDialog>;

export default meta;
type Story = StoryObj<typeof ShareDialog>;

export const Default: Story = {
  args: {
    implementations: mockImplementations,
    runs: mockRuns,
  },
};

export const NoRuns: Story = {
  args: {
    implementations: mockImplementations,
    runs: {},
  },
};

export const SingleRun: Story = {
  args: {
    implementations: mockImplementations,
    runs: {
      "1": [createBenchmarkRun("run1", "1", "quicksort.ts", 15_000)],
    },
  },
};
