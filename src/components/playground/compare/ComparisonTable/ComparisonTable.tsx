import { Info, Square } from "lucide-react";
import { BenchmarkRun } from "@/stores/benchmarkStore";
import { Implementation } from "@/stores/persistentStore";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ComparisonTableProps {
  implementations: (Implementation & { selected: boolean })[];
  runs: Record<string, BenchmarkRun[]>;
  isRunning: boolean;
  onSelectAll: (checked: boolean) => void;
  onToggleSelect: (id: string) => void;
  onRunSingle: (impl: Implementation) => void;
  onStop: (runId: string) => void;
}

export const ComparisonTable = ({
  implementations,
  runs,
  isRunning,
  onSelectAll,
  onToggleSelect,
  onRunSingle,
  onStop,
}: ComparisonTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">
            <Checkbox
              checked={implementations.length > 0 && implementations.every((impl) => impl.selected)}
              onCheckedChange={onSelectAll}
            />
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>
            <div className="flex items-center">
              Total Time (ms)
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="ml-1 w-4 h-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Total execution time in milliseconds</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </TableHead>
          <TableHead>
            <div className="flex items-center">
              Ops/sec
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="ml-1 w-4 h-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Operations per second</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {implementations.map((item) => {
          const run = runs[item.id]?.at(-1);
          return (
            <TableRow key={item.id}>
              <TableCell>
                <Checkbox checked={item.selected} onCheckedChange={() => onToggleSelect(item.id)} />
              </TableCell>
              <TableCell>{item.filename}</TableCell>
              <TableCell>{run?.status ?? "N/A"}</TableCell>
              <TableCell>{run?.elapsedTime?.toFixed(2) || "-"}</TableCell>
              <TableCell>{run?.result?.stats.opsPerSecond.average.toFixed(2) || "-"}</TableCell>
              <TableCell className="text-right">
                {run?.status === "running" || run?.status === "warmup" ?
                  <div className="flex gap-2 justify-end items-center">
                    <Progress className="w-[100px]" value={run.progress} />
                    <Button size="sm" variant="outline" onClick={() => onStop(run.id)}>
                      <Square className="w-4 h-4" />
                    </Button>
                  </div>
                : <div className="space-x-2">
                    <Button disabled={isRunning} variant="outline" onClick={() => onRunSingle(item)}>
                      {run?.result ? "Re-Run" : "Run"}
                    </Button>
                  </div>
                }
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

