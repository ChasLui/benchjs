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
        `fixed top-0 left-0 right-0 z-50 transition-all duration-200`,
        isScrolled ? "bg-background/80 backdrop-blur-md border-b border-border" : "",
        className,
      )}
    >
      <header className="flex justify-between items-center py-1 px-2 border-b border-border">
        {/* logo */}
        <div className="flex gap-2 items-center">
          <Link to="/">
            <Logo noIcon />
          </Link>
          {postLogoElement}
        </div>

        {/* navigation */}
        <nav className="flex gap-1.5 items-center">
          <ThemeSwitcher />
          {customNav}
          {!customNav && (
            <>
              <Link to="/playground">
                <Button type="button" variant="link">
                  Playground
                </Button>
              </Link>
              <Link target="_blank" to="https://github.com/3rd/benchjs">
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
