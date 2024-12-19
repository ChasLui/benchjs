import type { Meta, StoryObj } from "@storybook/react";
import { FileTree } from "./FileTree";

const meta: Meta<typeof FileTree> = {
  title: "Common/FileTree",
  component: FileTree,
};
export default meta;

type Story = StoryObj<typeof FileTree>;

export const Default: Story = {
  args: {
    item: {
      name: "root",
      type: "root",
      children: [
        { name: "dist", type: "folder", children: [] },
        { name: "node_modules", type: "folder", children: [], count: 42 },
        {
          name: "src",
          type: "folder",
          children: [
            {
              name: "main.ts",
              type: "file",
            },
          ],
        },
      ],
    },
  },
};

export const WithActiveFile: Story = {
  args: {
    ...Default.args,
    activeFile: "main.ts",
  },
};
