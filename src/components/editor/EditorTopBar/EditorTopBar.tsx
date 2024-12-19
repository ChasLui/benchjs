import { Link } from "react-router";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

interface EditorTopBarProps {
  onShare?: () => void;
}

export const EditorTopBar = ({ onShare }: EditorTopBarProps) => {
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

        {/* menu */}
        {/*   <div className="flex items-center space-x-2"> */}
        {/*     <DropdownMenu> */}
        {/*       <DropdownMenuTrigger asChild> */}
        {/*         <button className="py-1 px-2 text-sm rounded hover:bg-gray-200">File</button> */}
        {/*       </DropdownMenuTrigger> */}
        {/*       <DropdownMenuContent> */}
        {/*         <DropdownMenuItem>Share</DropdownMenuItem> */}
        {/*         <DropdownMenuItem>Export</DropdownMenuItem> */}
        {/*       </DropdownMenuContent> */}
        {/*     </DropdownMenu> */}
        {/**/}
        {/*     <DropdownMenu> */}
        {/*       <DropdownMenuTrigger asChild> */}
        {/*         <button className="py-1 px-2 text-sm rounded hover:bg-gray-200">About</button> */}
        {/*       </DropdownMenuTrigger> */}
        {/*       <DropdownMenuContent> */}
        {/*         <DropdownMenuItem>Help</DropdownMenuItem> */}
        {/*         <DropdownMenuItem>Check for updates</DropdownMenuItem> */}
        {/*       </DropdownMenuContent> */}
        {/*     </DropdownMenu> */}
        {/*   </div> */}
        {/* </div> */}
      </div>

      {/* right */}
      <div className="flex items-center space-x-2">
        <button
          className="py-1 px-2 text-sm rounded hover:bg-gray-200"
          onClick={onShare}
        >
          Share
        </button>
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
