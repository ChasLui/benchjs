import { format } from "date-fns";
import { formatCount } from "@/lib/formatters";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface ConsoleLog {
  timestamp: number;
  level: string;
  message: string;
  count: number;
}

interface ConsoleTabProps {
  logs: ConsoleLog[] | null;
}

const getLogColor = (type: string) => {
  switch (type) {
    case "error": {
      return "text-red-600";
    }
    case "warn": {
      return "text-yellow-600";
    }
    case "info": {
      return "text-blue-600";
    }
    case "debug": {
      return "text-purple-600";
    }
    default: {
      return "text-foreground";
    }
  }
};

export const ConsoleTab = ({ logs }: ConsoleTabProps) => {
  const displayLogs = logs ?? [];

  return (
    <ScrollArea className="border-0">
      <div className="p-4 space-y-1 font-mono text-sm">
        {displayLogs.length === 0 && (
          <div className="text-sm italic text-muted-foreground">No console output yet.</div>
        )}
        {displayLogs.map((log) => (
          <div key={log.timestamp} className="flex gap-2 items-start">
            <span className="whitespace-nowrap text-muted-foreground">
              {format(log.timestamp, "HH:mm:ss.SSS")}
            </span>
            <span className={getLogColor(log.level)}>{log.message}</span>
            {log.count > 1 && (
              <span className="px-1 text-xs rounded-lg bg-muted text-muted-foreground">
                x{formatCount(log.count)}
              </span>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
