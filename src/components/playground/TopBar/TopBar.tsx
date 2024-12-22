import { Share2 } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";

interface TopBarProps {
  onShare?: () => void;
}

export const TopBar = ({ onShare }: TopBarProps) => {
  return (
    <div className="flex justify-between items-center py-1 px-3 bg-gray-100 border-b">
      {/* left */}
      <div className="flex items-center">
        {/* logo */}
        <Link className="flex items-center pr-3" to="/">
          <h1 className="text-lg font-bold">
            <span className="text-zinc-900">Bench</span>
            <span className="p-0.5 bg-yellow-400 text-zinc-800">JS</span>
          </h1>
        </Link>
      </div>
      {/* right */}
      <div className="flex gap-2 items-center">
        <Button className="gap-2" variant="outline" onClick={onShare}>
          <Share2 className="w-4 h-4" />
          Share
        </Button>
      </div>

      {/* github */}
      {/* <a */}
      {/*   className="py-1 px-2 text-sm rounded hover:bg-gray-200" */}
      {/*   href="https://github.com/3rd/benchjs" */}
      {/*   rel="noopener noreferrer" */}
      {/*   target="_blank" */}
      {/* > */}
      {/*   GitHub */}
      {/* </a> */}
    </div>
  );
};
