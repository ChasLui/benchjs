declare const self: DedicatedWorkerGlobalScope;
import { Bench, BenchmarkOptions } from "benchmate";
import { serializeError } from "serialize-error";
import { MainToWorkerMessage, WorkerToMainMessage } from "./types";

const CONSOLE_FLUSH_INTERVAL_MS = 500;

const DEFAULT_OPTIONS: BenchmarkOptions = {
  iterations: "auto",
  time: 3000,
  method: "auto",
  quiet: true,
};

interface LogEntry {
  level: "debug" | "error" | "info" | "log" | "warn";
  message: string;
  count: number;
}

// console logging batching
let currentRunId: string | null = null;
let lastFlushTimestamp = 0;
const logsBuffer: LogEntry[] = [];
const flushLogs = (force = false) => {
  if (logsBuffer.length === 0 || !currentRunId) return;
  const now = Date.now();
  if (!force && now - lastFlushTimestamp < CONSOLE_FLUSH_INTERVAL_MS) return;

  self.postMessage({
    type: "consoleBatch",
    runId: currentRunId,
    logs: [...logsBuffer],
  });

  logsBuffer.length = 0;
  lastFlushTimestamp = now;
};

// patch console methods
const patchConsole = (runId: string, prevent = false) => {
  currentRunId = runId;
  const methods = ["log", "warn", "error", "info", "debug"] as const;

  for (const level of methods) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (console[level] as any) = function (...args: unknown[]) {
      if (prevent) return;

      const message = args.map((arg) => (typeof arg === "string" ? arg : JSON.stringify(arg))).join(" ");

      const lastLog = logsBuffer[logsBuffer.length - 1];
      if (lastLog && lastLog.level === level && lastLog.message === message) {
        lastLog.count = lastLog.count + 1;
      } else {
        logsBuffer.push({ level, message, count: 1 });
      }
      flushLogs();
    };
  }
};

const postMessage = (message: WorkerToMainMessage) => {
  self.postMessage(message);
};

const handleStartRuns = async (
  runs: { runId: string; processedCode: string }[],
  options: Partial<BenchmarkOptions> = {},
) => {
  try {
    // setup runner
    const benchmateOptions: BenchmarkOptions = {
      ...DEFAULT_OPTIONS,
      ...options,
      batching: { enabled: true, size: "auto", ...options?.batching },
      warmup: { enabled: true, iterations: "auto", ...options?.warmup },
      setup: (task) => {
        // patch globals
        patchConsole(task.name);
      },
    };
    const runner = new Bench(benchmateOptions);

    // mute console
    patchConsole("none", true);

    // setup event handlers
    runner.on("taskWarmupStart", ({ task: runId }) => {
      postMessage({ type: "warmupStart", runId });
    });

    runner.on("taskWarmupEnd", ({ task: runId }) => {
      postMessage({ type: "warmupEnd", runId });
    });

    runner.on("progress", ({ task: runId, iterationsCompleted, iterationsTotal, elapsedTime }) => {
      postMessage({
        type: "progress",
        runId,
        progress: (iterationsCompleted / iterationsTotal) * 100,
        iterationsCompleted,
        totalIterations: iterationsTotal,
        elapsedTime,
      });
    });

    runner.on("taskStart", ({ task: runId }) => {
      postMessage({ type: "taskStart", runId });
    });

    runner.on("setup", ({ task: runId }) => {
      postMessage({ type: "setup", runId });
    });

    runner.on("teardown", ({ task: runId }) => {
      postMessage({ type: "teardown", runId });
    });

    runner.on("taskComplete", (result) => {
      // final console flush for task
      flushLogs(true);
      postMessage({ type: "taskComplete", runId: result.name });
    });

    // add tasks
    for (const run of runs) {
      // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
      const createBenchmarkFn = new Function(run.processedCode);
      const benchmarkFn = createBenchmarkFn();
      if (typeof benchmarkFn !== "function") {
        throw new TypeError("Benchmark code must return a function");
      }
      runner.add(run.runId, benchmarkFn as () => void);
    }

    // run benchmark
    const results = await runner.run();
    // final console flush
    flushLogs(true);

    // send results
    for (const run of runs) {
      const runResults = results.filter((r) => r.name === run.runId);
      postMessage({
        type: "result",
        runId: run.runId,
        result: runResults,
      });
    }
  } catch (error) {
    // send errors
    for (const run of runs) {
      postMessage({
        type: "error",
        runId: run.runId,
        error: serializeError(error).message || "Unknown error",
      });
    }
  }
};

self.addEventListener("message", async (event: MessageEvent<MainToWorkerMessage>) => {
  const message = event.data;

  // eslint-disable-next-line sonarjs/no-small-switch
  switch (message.type) {
    case "start": {
      await handleStartRuns(message.runs, message.options);
      break;
    }
    default: {
      console.error("Unknown message type:", message);
      break;
    }
  }
});
