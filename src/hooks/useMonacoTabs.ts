import { useCallback, useState } from "react";
import { MonacoTab } from "@/components/common/MonacoTab";

export const useMonacoTabs = () => {
  const [tabs, setTabs] = useState<MonacoTab[]>(() => [
    {
      name: "README.md",
      active: true,
    },
  ]);

  const changeTab = useCallback((file: { name: string; active: boolean }) => {
    if (!file.name) return;
    setTabs((prev) =>
      prev.map((item) => ({
        ...item,
        active: item.name === file.name,
      })),
    );
  }, []);

  const closeTab = useCallback((file: { name: string; active: boolean }) => {
    if (!file.name) return;

    let nextActiveFile = "";

    setTabs((prev) => {
      const filtered = prev.filter((item) => item.name !== file.name);
      if (filtered.length === 0) {
        nextActiveFile = "README.md";
        return [
          {
            name: "README.md",
            active: true,
          },
        ];
      }
      if (file.active && filtered.length > 0) {
        filtered[filtered.length - 1].active = true;
        nextActiveFile = filtered[filtered.length - 1].name;
      }
      return filtered;
    });
  }, []);

  const openTab = useCallback((filename: string) => {
    if (!filename) return;

    setTabs((prev) => {
      const isOpen = prev.some((item) => item.name === filename);
      if (isOpen) {
        return prev.map((item) => ({
          ...item,
          active: item.name === filename,
        }));
      }
      return [
        ...prev.map((item) => ({ ...item, active: false })),
        { name: filename, active: true },
      ];
    });
  }, []);

  const activeTabName = tabs.find((item) => item.active)?.name;

  return {
    tabs,
    activeTabName,
    changeTab,
    closeTab,
    openTab,
    setTabs,
  };
};
