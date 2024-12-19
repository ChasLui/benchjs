import { Link } from "react-router";
import { Button } from "@/components/ui/button";

export interface HeaderProps {
  postLogoElement?: React.ReactNode;
}

export const Header = ({ postLogoElement }: HeaderProps) => {
  return (
    <header className="flex justify-between items-center py-2 px-4 border-b">
      {/* logo */}
      <div className="flex gap-4 items-center">
        <Link to="/">
          <h1 className="text-xl font-bold">
            <span className="text-zinc-900">Bench</span>
            <span className="p-0.5 bg-yellow-400 text-zinc-800">JS</span>
          </h1>
        </Link>
        {postLogoElement}
      </div>

      {/* navigation */}
      <nav className="flex">
        <Link className="text-zinc-900 hover:text-zinc-700" to="/playground">
          <Button type="button" variant="link">
            Playground
          </Button>
        </Link>
        <Link
          className="text-sm"
          target="_blank"
          to="https://github.com/3rd/benchjs"
        >
          <Button type="button" variant="link">
            GitHub
          </Button>
        </Link>
      </nav>
    </header>
  );
};
