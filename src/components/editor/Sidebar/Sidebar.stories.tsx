import type { Meta, StoryObj } from "@storybook/react";
import { Sidebar } from "./Sidebar";

const meta: Meta<typeof Sidebar> = {
  title: "Editor/Sidebar",
  component: Sidebar,
  render: (args) => (
    <div className="inline-block relative">
      <Sidebar {...args} />
    </div>
  ),
};
export default meta;

type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {
  args: {},
};
