import { BenchmarkOptions } from "benchmate";
import { nanoid } from "nanoid";
import { serializeError } from "serialize-error";
import { useBenchmarkStore } from "@/stores/benchmarkStore";
import { Implementation } from "@/stores/persistentStore";
import { bundleBenchmarkCode } from "../code-processor/bundle-benchmark-code";
import { BenchmarkResult, WorkerToMainMessage } from "./types";
import BenchmarkWorker from "./worker?worker";

let worker: Worker | null = null;

export const benchmarkService = {
  async runBenchmark(
    setupCode: string,
    implementations: Implementation[],
    runnerOptions: Partial<BenchmarkOptions> = {},
  ): Promise<BenchmarkResult[]> {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        const store = useBenchmarkStore.getState();
        const totalIterations =
          "iterations" in runnerOptions && typeof runnerOptions.iterations === "number"
            ? runnerOptions.iterations
            : 0;

        // create runs
        const runs = implementations.map((implementation) => ({
          id: nanoid(),
          implementationId: implementation.id,
          createdAt: Date.now(),
          warmupStartedAt: null,
          warmupEndedAt: null,
          status: "idle" as const,
          filename: implementation.filename,
          originalCode: implementation.content,
          processedCode: "",
          progress: 0,
          elapsedTime: 0,
          iterations: 0,
          totalIterations,
          error: null,
          result: null,
        }));
        store.addRuns(runs);

        // pre-processing
        const processedRuns = await Promise.all(
          runs.map(async (run) => {
            try {
              const processedCode = await bundleBenchmarkCode(run.originalCode, setupCode);
              store.updateRun(run.id, {
                processedCode,
                status: "idle",
              });
              return {
                runId: run.id,
                processedCode,
                success: true,
              };
            } catch (error) {
              store.updateRun(run.id, {
                status: "failed",
                error: serializeError(error).message || "Failed to process code",
              });
              return {
                runId: run.id,
                processedCode: "",
                success: false,
                error: serializeError(error).message,
              };
            }
          }),
        );

        // bail if any pre-processing failed
        const hasProcessingError = processedRuns.some((r) => !r.success);
        if (hasProcessingError) {
          const remainingRuns = processedRuns.filter((r) => r.success);
          for (const run of remainingRuns) {
            store.updateRun(run.runId, {
              status: "failed",
              error: "Cancelled due to errors in other implementations",
            });
          }
          reject(new Error("Failed to process one or more implementations"));
          return;
        }

        // setup worker
        if (worker) worker.terminate();
        worker = new BenchmarkWorker();

        worker.addEventListener("message", (event: MessageEvent<WorkerToMainMessage>) => {
          const message = event.data;
          const run = runs.find((r) => r.id === message.runId);
          if (!run) return;

          switch (message.type) {
            case "warmupStart": {
              store.updateRun(run.id, { status: "warmup", warmupStartedAt: Date.now() });
              break;
            }
            case "warmupEnd": {
              store.updateRun(run.id, { status: "running", warmupEndedAt: Date.now() });
              break;
            }
            case "progress": {
              store.updateRun(run.id, {
                progress: message.progress,
                elapsedTime: message.elapsedTime,
                iterations: message.iterationsCompleted,
                totalIterations: message.totalIterations,
              });
              break;
            }
            case "result": {
              store.updateRun(run.id, {
                status: "completed",
                progress: 100,
                result: message.result[0],
              });
              resolve(message.result);
              break;
            }
            case "error": {
              store.updateRun(run.id, {
                status: "failed",
                error: message.error,
              });
              reject(new Error(message.error));
              break;
            }
            case "console": {
              store.addConsoleLog(message.runId, {
                level: message.level,
                message: message.message,
                timestamp: Date.now(),
              });
              break;
            }
            case "consoleBatch": {
              store.bulkAddConsoleLogs(
                message.runId,
                message.logs.map((log) => ({
                  level: log.level,
                  message: log.message,
                  timestamp: Date.now(),
                  count: log.count,
                })),
              );
              break;
            }
            default: {
              console.error("Unknown message type:", message);
              break;
            }
          }
        });

        // start benchmark
        worker.postMessage({
          type: "startRuns",
          runs: processedRuns.map((run) => ({
            runId: run.runId,
            processedCode: run.processedCode,
          })),
          options: runnerOptions,
        });
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
        reject(error);
      }
    });
  },
};
