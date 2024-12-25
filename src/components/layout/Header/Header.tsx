import { useEffect, useState } from "react";
import { Link } from "react-router";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/common/Logo";
import { ThemeSwitcher } from "@/components/layout/ThemeSwitcher";
import { Button } from "@/components/ui/button";

export interface HeaderProps {
  className?: string;
  customNav?: React.ReactNode;
  postLogoElement?: React.ReactNode;
}

export const Header = ({ postLogoElement, customNav, className }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={cn(
        `fixed top-0 left-0 right-0 z-50 transition-all duration-2001`,
        isScrolled ? "bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md shadow-sm" : "",
        className,
      )}
    >
      <header className="flex justify-between items-center py-1 px-4 border-b dark:border-zinc-800">
        {/* logo */}
        <div className="flex gap-4 items-center">
          <Link to="/">
            <Logo noIcon />
          </Link>
          {postLogoElement}
        </div>

        {/* navigation */}
        <nav className="flex gap-2 items-center">
          <ThemeSwitcher />
          {customNav}
          {!customNav && (
            <>
              <Link
                className="text-zinc-900 dark:text-zinc-100 dark:hover:text-zinc-300 hover:text-zinc-700"
                to="/playground"
              >
                <Button type="button" variant="link">
                  Playground
                </Button>
              </Link>
              <Link
                className="text-sm dark:text-zinc-100"
                target="_blank"
                to="https://github.com/3rd/benchjs"
              >
                <Button type="button" variant="link">
                  GitHub
                </Button>
              </Link>
            </>
          )}
        </nav>
      </header>
    </div>
  );
};
