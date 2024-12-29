import { BenchmarkOptions } from "benchmate";
import { nanoid } from "nanoid";
import { serializeError } from "serialize-error";
import { useBenchmarkStore } from "@/stores/benchmarkStore";
import { Implementation } from "@/stores/persistentStore";
import { usePersistentStore } from "@/stores/persistentStore";
import { features } from "@/config";
import { bundleBenchmarkCode } from "../code-processor/bundle-benchmark-code";
import { BenchmarkResult, WorkerToMainMessage } from "./types";
import BenchmarkWorker from "./worker?worker";

let worker: Worker | null = null;

const stopBenchmark = (runId: string): void => {
  const store = useBenchmarkStore.getState();
  if (worker) {
    worker.terminate();
    worker = null;
  }

  store.updateRun(runId, {
    status: "cancelled",
    progress: 0,
    error: null,
  });
};

const getMemoryUsage = async () => {
  if (
    typeof performance !== "undefined" &&
    "measureUserAgentSpecificMemory" in performance &&
    self.crossOriginIsolated
  ) {
    try {
      const memResult = await performance.measureUserAgentSpecificMemory();
      return memResult.bytes;
    } catch (error) {
      console.error("Failed to measure memory:", error);
    }
  }
  return 0;
};

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
          "iterations" in runnerOptions && typeof runnerOptions.iterations === "number" ?
            runnerOptions.iterations
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
          completedIterations: 0,
          totalIterations,
          error: null,
          result: null,
        }));
        store.addRuns(runs);

        // pre-processing
        const processedRuns = await Promise.all(
          runs.map(async (run) => {
            try {
              const persistentStore = usePersistentStore.getState();
              const processedCode = await bundleBenchmarkCode(
                run.originalCode,
                setupCode,
                persistentStore.libraries,
              );
              store.updateRun(run.id, {
                processedCode,
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

          switch (message.type) {
            case "warmupStart": {
              store.updateRun(message.runId, { status: "warmup", warmupStartedAt: Date.now() });
              store.addConsoleLog(message.runId, {
                level: "info",
                message: "[benchmate] Warmup started",
                timestamp: Date.now(),
                count: 1,
              });
              break;
            }
            case "warmupEnd": {
              store.updateRun(message.runId, { status: "running", warmupEndedAt: Date.now() });
              store.addConsoleLog(message.runId, {
                level: "info",
                message: "[benchmate] Warmup ended",
                timestamp: Date.now(),
                count: 1,
              });
              break;
            }
            case "progress": {
              store.updateRun(message.runId, {
                progress: message.progress,
                elapsedTime: message.elapsedTime,
                completedIterations: message.iterationsCompleted,
                totalIterations: message.totalIterations,
              });

              // record chart data on every progress event
              if (message.iterationsCompleted > 0) {
                store.addChartPoint(message.runId, {
                  time: message.elapsedTime,
                  timePerOp: message.elapsedTime / message.iterationsCompleted,
                  iterations: message.iterationsCompleted,
                });
              }
              break;
            }
            case "result": {
              store.updateRun(message.runId, {
                status: "completed",
                progress: 100,
                result: message.result[0],
              });
              store.addConsoleLog(message.runId, {
                level: "info",
                message: "[benchmate] Benchmark completed successfully",
                timestamp: Date.now(),
                count: 1,
              });
              // TODO: change for multiple results
              if (features.memory.enabled) {
                (async () => {
                  const memoryUsage = await getMemoryUsage();
                  store.updateRun(message.runId, {
                    memoryUsage,
                  });
                  resolve(message.result);
                })();
              }
              break;
            }
            case "error": {
              store.updateRun(message.runId, {
                status: "failed",
                error: message.error,
              });
              store.addConsoleLog(message.runId, {
                level: "error",
                message: `[benchmate] ${message.error}`,
                timestamp: Date.now(),
                count: 1,
              });
              reject(new Error(message.error));
              break;
            }
            case "consoleBatch": {
              store.bulkAddConsoleLogs(
                message.runId,
                message.logs.map((log) => ({
                  level: log.level,
                  message: `[worker] ${log.message}`,
                  timestamp: Date.now(),
                  count: log.count,
                })),
              );
              break;
            }
            case "taskStart": {
              store.addConsoleLog(message.runId, {
                message: `[benchmate] Task started: ${message.runId}`,
                level: "info",
                timestamp: Date.now(),
                count: 1,
              });
              break;
            }
            case "setup": {
              store.addConsoleLog(message.runId, {
                message: "[benchmate] Task setup completed",
                level: "info",
                timestamp: Date.now(),
                count: 1,
              });
              break;
            }
            case "teardown": {
              store.addConsoleLog(message.runId, {
                message: "[benchmate] Teardown",
                level: "info",
                timestamp: Date.now(),
                count: 1,
              });
              break;
            }
            case "taskComplete": {
              store.addConsoleLog(message.runId, {
                message: `[benchmate] Task completed: ${message.runId}`,
                level: "info",
                timestamp: Date.now(),
                count: 1,
              });
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
          type: "start",
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
  stopBenchmark,
};
