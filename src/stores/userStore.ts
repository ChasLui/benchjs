import { create } from "zustand";
import { persist } from "zustand/middleware";

const VERTICAL_LAYOUT_MIN_WIDTH = 768;

export type LayoutMode = "horizontal" | "vertical";

interface UserPreferences {
  codeViewLayout: LayoutMode;
  setCodeViewLayout: (layout: LayoutMode) => void;
}

export const useUserStore = create<UserPreferences>()(
  persist(
    (set) => ({
      codeViewLayout:
        typeof window === "undefined" ? "vertical" : (
          (window.innerWidth >= VERTICAL_LAYOUT_MIN_WIDTH && "vertical") || "horizontal"
        ),
      setCodeViewLayout: (layout) => set({ codeViewLayout: layout }),
    }),
    {
      name: "user-preferences",
    },
  ),
);

