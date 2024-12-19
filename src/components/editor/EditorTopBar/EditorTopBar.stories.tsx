import type { Meta, StoryObj } from "@storybook/react";
import { EditorTopBar } from "./EditorTopBar";

const meta: Meta<typeof EditorTopBar> = {
  title: "Editor/EditorTopBar",
  component: EditorTopBar,
};
export default meta;

type Story = StoryObj<typeof EditorTopBar>;

export const Default: Story = {
  args: {},
};
