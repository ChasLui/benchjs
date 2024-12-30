import { useEffect } from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { useUserStore } from "@/stores/userStore";
import { Button } from "@/components/ui/button";

export function ThemeSwitcher() {
  const { theme, setTheme } = useUserStore();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  return (
    <Button size="icon" variant="ghost" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      <SunIcon className="w-4 h-4 transition-all scale-100 rotate-0 dark:scale-0 dark:-rotate-90" />
      <MoonIcon className="absolute w-4 h-4 transition-all scale-0 rotate-90 dark:scale-100 dark:rotate-0" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

