import type { Meta, StoryObj } from "@storybook/react";
import { RunTab } from "./RunTab";

const meta: Meta<typeof RunTab> = {
  title: "Editor/RunPanel/Tabs/RunTab",
  component: RunTab,
};
export default meta;

type Story = StoryObj<typeof RunTab>;

export const Default: Story = {
  args: {
    isRunning: false,
    latestRun: {
      id: "123",
      implementationId: "main.ts",
      createdAt: Date.now(),
      warmupStartedAt: null,
      warmupEndedAt: null,
      status: "completed",
      filename: "main.ts",
      originalCode: `
        // Write your implementation here
      `,
      processedCode: `
        // Write your implementation here
      `,
      progress: 100,
      elapsedTime: 1000,
      iterations: 1000,
      totalIterations: 1000,
      error: null,
      result: {
        name: "main.ts",
        stats: {
          samples: 1000,
          batches: 1000,
          time: {
            total: 1000,
            min: 1000,
            max: 1000,
            average: 1000,
            percentile50: 1000,
            percentile90: 1000,
            percentile95: 1000,
          },
          opsPerSecond: {
            average: 1000,
            max: 1000,
            min: 1000,
            margin: 1000,
          },
        },
      },
    },
    onRun: () => console.log("Run"),
    onPause: () => console.log("Pause"),
    onReset: () => console.log("Reset"),
  },
};
