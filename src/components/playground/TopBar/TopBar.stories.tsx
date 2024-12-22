import type { Meta, StoryObj } from "@storybook/react";
import { TopBar } from "./TopBar";

const meta: Meta<typeof TopBar> = {
  title: "Playground/TopBar",
  component: TopBar,
};
export default meta;

type Story = StoryObj<typeof TopBar>;

export const Default: Story = {
  args: {},
};
