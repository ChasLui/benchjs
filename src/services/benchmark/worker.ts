declare const self: DedicatedWorkerGlobalScope;
import { Bench } from "benchmate";
import { serializeError } from "serialize-error";
import { BenchmarkOptions } from "./types";
import { MainToWorkerMessage, WorkerToMainMessage } from "./types";

const DEFAULT_OPTIONS: BenchmarkOptions = {
  iterations: "auto",
  time: 3000,
  batching: {
    enabled: true,
    size: "auto",
  },
  warmup: {
    enabled: true,
    iterations: "auto",
  },
  method: "auto",
  quiet: true,
};

const postMessage = (message: WorkerToMainMessage) => {
  self.postMessage(message);
};

const handleStartRuns = async (
  runs: { runId: string; processedCode: string }[],
  options: Partial<BenchmarkOptions> = {},
) => {
  const startTime = Date.now();

  try {
    // setup runner
    const benchmateOptions = {
      ...DEFAULT_OPTIONS,
      ...options,
      batching: { ...DEFAULT_OPTIONS.batching, ...options?.batching },
      warmup: { ...DEFAULT_OPTIONS.warmup, ...options?.warmup },
    };
    const runner = new Bench(benchmateOptions);

    // setup event handlers
    runner.on("progress", ({ task: runId, iterationsCompleted, iterationsTotal }) => {
      postMessage({
        type: "progress",
        runId,
        progress: (iterationsCompleted / iterationsTotal) * 100,
        iterationsCompleted,
        totalIterations: iterationsTotal,
        elapsedTime: Date.now() - startTime,
      });
    });

    // add tasks
    for (const run of runs) {
      // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
      runner.add(run.runId, new Function(run.processedCode) as () => void);
    }

    // run benchmark
    const results = await runner.run();

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

  switch (message.type) {
    case "startRuns": {
      await handleStartRuns(message.runs, message.options);
      break;
    }
    case "cancelRun": {
      // TODO: implement
      break;
    }
    default: {
      console.error("Unknown message type:", message);
      break;
    }
  }
});
