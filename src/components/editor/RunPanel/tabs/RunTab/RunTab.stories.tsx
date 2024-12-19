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
    progress: 0,
    elapsedTime: 0,
    iterationsCompleted: 0,
    totalIterations: 0,
    averageTime: 0,
    peakMemory: 0,
    onRun: () => console.log("Run"),
    onPause: () => console.log("Pause"),
    onReset: () => console.log("Reset"),
    error: null,
    comparisonResults: null,
  },
};
