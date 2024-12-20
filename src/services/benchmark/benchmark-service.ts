import { nanoid } from "nanoid";
import { serializeError } from "serialize-error";
import { useBenchmarkStore } from "@/stores/benchmarkStore";
import { Implementation } from "@/stores/persistentStore";
import { bundleBenchmarkCode } from "../code-processor/bundle-benchmark-code";
import { BenchmarkOptions, BenchmarkResult, WorkerToMainMessage } from "./types";
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
        // create runs
        const runs = implementations.map((implementation) => ({
          id: nanoid(),
          implementationId: implementation.id,
          createdAt: Date.now(),
          status: "idle" as const,
          filename: implementation.filename,
          originalCode: implementation.content,
          processedCode: "",
          progress: 0,
          elapsedTime: 0,
          iterations: 0,
          error: null,
          result: null,
        }));
        useBenchmarkStore.getState().addRuns(runs);

        // pre-processing
        const processedRuns = await Promise.all(
          runs.map(async (run) => {
            try {
              const implementation = implementations.find((item) => item.id === run.implementationId);
              if (!implementation) throw new Error("Implementation not found");
              const processedCode = await bundleBenchmarkCode(
                implementation.content,
                setupCode,
                implementation.filename,
              );
              useBenchmarkStore.getState().updateRun(run.id, { processedCode });
              return {
                runId: run.id,
                processedCode,
                success: true as const,
              };
            } catch (error) {
              useBenchmarkStore.getState().updateRun(run.id, {
                status: "failed",
                error: serializeError(error).message || "Failed to process code",
              });
              return {
                runId: run.id,
                success: false as const,
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
            useBenchmarkStore.getState().updateRun(run.runId, {
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
            case "progress": {
              useBenchmarkStore.getState().updateRun(run.id, {
                status: "running",
                progress: message.progress,
                iterations: message.iterationsCompleted,
                elapsedTime: message.elapsedTime,
              });
              break;
            }
            case "result": {
              useBenchmarkStore.getState().updateRun(run.id, {
                status: "completed",
                progress: 100,
                result: message.result[0],
              });
              resolve(message.result);
              break;
            }
            case "error": {
              useBenchmarkStore.getState().updateRun(run.id, {
                status: "failed",
                error: message.error,
              });
              reject(new Error(message.error));
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
