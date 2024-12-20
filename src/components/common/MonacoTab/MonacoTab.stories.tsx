import type { Meta, StoryObj } from "@storybook/react";
import { MonacoTab } from "./MonacoTab";

const meta: Meta<typeof MonacoTab> = {
  title: "Common/MonacoTab",
  component: MonacoTab,
};
export default meta;

type Story = StoryObj<typeof MonacoTab>;

export const Default: Story = {
  args: {
    tab: {
      id: "main.ts",
      name: "main.ts",
      active: false,
    },
  },
};

export const Active: Story = {
  args: {
    tab: {
      id: "main.ts",
      name: "main.ts",
      active: true,
    },
  },
};
