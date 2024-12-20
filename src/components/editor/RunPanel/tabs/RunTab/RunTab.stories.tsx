import type { Meta, StoryObj } from "@storybook/react";
import { RunTab } from "./RunTab";

const meta = {
  component: RunTab,
} satisfies Meta<typeof RunTab>;

export default meta;
type Story = StoryObj<typeof RunTab>;

export const Default: Story = {
  args: {
    isRunning: false,
    chartData: [],
    addChartPoint: () => {},
    clearChartData: () => {},
  },
};

export const Running: Story = {
  args: {
    isRunning: true,
    latestRun: {
      id: "1",
      implementationId: "1",
      createdAt: Date.now(),
      warmupStartedAt: null,
      warmupEndedAt: null,
      status: "running",
      filename: "test.js",
      originalCode: "",
      processedCode: "",
      progress: 50,
      elapsedTime: 1000,
      iterations: 500,
      totalIterations: 1000,
      error: null,
      result: null,
    },
    chartData: [],
    addChartPoint: () => {},
    clearChartData: () => {},
  },
};
