import type { Meta, StoryObj } from "@storybook/react";
import { TopBar as TopBar } from "./TopBar";

const meta: Meta<typeof TopBar> = {
  title: "Editor/TopBar",
  component: TopBar,
};
export default meta;

type Story = StoryObj<typeof TopBar>;

export const Default: Story = {
  args: {},
};
