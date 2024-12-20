import { useCallback, useEffect, useState } from "react";
import { Implementation } from "@/stores/persistentStore";
import { MonacoTab } from "@/components/common/MonacoTab";

interface UseMonacoTabsOptions {
  initialActiveTabId?: string | null;
  onTabChange?: (tabId: string | null) => void;
  onTabClose?: (tabId: string) => void;
}

export const useMonacoTabs = (implementations: Implementation[], options?: UseMonacoTabsOptions) => {
  const [tabs, setTabs] = useState<MonacoTab[]>(() => {
    const initialTabs = [{ id: "README.md", name: "README.md", active: true }];
    if (options?.initialActiveTabId) {
      const item = implementations.find((i) => i.id === options.initialActiveTabId);
      if (item) {
        initialTabs[0].active = false;
        initialTabs.push({ id: item.id, name: item.filename, active: true });
      }
    }
    return initialTabs;
  });

  const changeTab = useCallback(
    (tab: MonacoTab | string) => {
      const tabId = typeof tab === "string" ? tab : tab.id;
      setTabs((prev) =>
        prev.map((item) => ({
          ...item,
          active: item.id === tabId,
        })),
      );
      options?.onTabChange?.(tabId);
    },
    [options],
  );

  const closeTab = useCallback(
    (tab: MonacoTab) => {
      let nextActiveTabId: string | null = null;
      let hasNoOpenTabs = false;
      setTabs((prev) => {
        const filtered = prev.filter((item) => item.id !== tab.id);
        if (filtered.length === 0) {
          hasNoOpenTabs = true;
        } else if (tab.active) {
          filtered[filtered.length - 1].active = true;
          nextActiveTabId = filtered[filtered.length - 1].id;
        }
        return filtered;
      });

      options?.onTabClose?.(tab.id);

      if (hasNoOpenTabs) {
        const newTab = { id: "README.md", name: "README.md", active: true };
        setTabs((prev) => [...prev.map((item) => ({ ...item, active: false })), newTab]);
        changeTab(newTab);
      } else if (nextActiveTabId) {
        changeTab(nextActiveTabId);
      }
    },
    [changeTab, options],
  );

  const openTab = useCallback(
    (tab: MonacoTab | string) => {
      if (typeof tab === "string") {
        setTabs((prev) => prev.map((item) => ({ ...item, active: item.id === tab })));
        return;
      }

      const hasTab = tabs.some((item) => item.id === tab.id);
      if (hasTab) {
        setTabs((prev) => {
          return prev.map((item) => ({
            ...item,
            active: typeof tab === "string" ? item.id === tab : item.id === tab.id,
          }));
        });
      } else {
        const newTab = { id: tab.id, name: tab.name, active: true };
        setTabs((prev) => [...prev.map((item) => ({ ...item, active: false })), newTab]);
        changeTab(newTab);
      }
    },
    [changeTab, tabs],
  );

  const activeTabId = tabs.find((item) => item.active)?.id ?? null;

  useEffect(() => {
    const implementationNameMap = implementations.reduce(
      (acc, item) => {
        acc[item.id] = item.filename;
        return acc;
      },
      {} as Record<string, string>,
    );
    setTabs((prev) =>
      prev.map((item) => ({
        ...item,
        name: implementationNameMap[item.id] ?? item.name,
      })),
    );
  }, [implementations]);

  return {
    tabs,
    activeTabId,
    changeTab,
    closeTab,
    openTab,
    setTabs,
  };
};
