import type { Meta, StoryObj } from "@storybook/react";
import { RunPanel } from "./RunPanel";

const meta: Meta<typeof RunPanel> = {
  title: "Editor/RunPanel",
  component: RunPanel,
};
export default meta;

type Story = StoryObj<typeof RunPanel>;

export const Default: Story = {
  args: {},
};
