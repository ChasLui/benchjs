import { create } from "zustand";
import { persist } from "zustand/middleware";

const VERTICAL_LAYOUT_MIN_WIDTH = 768;

export type LayoutMode = "horizontal" | "vertical";
export type Theme = "light" | "dark";

interface UserPreferences {
  codeViewLayout: LayoutMode;
  theme: Theme;
  setCodeViewLayout: (layout: LayoutMode) => void;
  setTheme: (theme: Theme) => void;
}

export const useUserStore = create<UserPreferences>()(
  persist(
    (set) => ({
      codeViewLayout:
        typeof window === "undefined" ? "vertical" : (
          (window.innerWidth >= VERTICAL_LAYOUT_MIN_WIDTH && "vertical") || "horizontal"
        ),
      // default to light theme
      theme: "light",
      setCodeViewLayout: (layout) => set({ codeViewLayout: layout }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "user-preferences",
    },
  ),
);

