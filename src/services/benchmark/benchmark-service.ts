import { Bench } from "benchmate";
import { nanoid } from "nanoid";
import { serializeError } from "serialize-error";
import { ImplementationRun, useBenchmarkStore } from "@/stores/benchmarkStore";
import { Implementation } from "@/stores/persistentStore";
import { bundleBenchmarkCode } from "../code-processor/bundle-benchmark-code";
import { BenchmarkOptions, BenchmarkResult } from "./types";

type ProcessedTask = { success: true; id: string; code: string };
type UnprocessedTask = { success: false; id: string; error?: string };

const DEFAULT_OPTIONS: BenchmarkOptions = {
  iterations: "auto",
  time: 1000,
  batching: {
    enabled: true,
    size: "auto",
  },
  warmup: {
    enabled: true,
    iterations: "auto",
  },
  method: "auto",
  quiet: false,
};

const tasksAreProcessed = (tasks: (ProcessedTask | UnprocessedTask)[]): tasks is ProcessedTask[] => {
  return tasks.every((task) => task.success);
};

export const benchmarkService = {
  async runBenchmark(
    setupCode: string,
    implementations: Implementation[],
    runnerOptions: Partial<BenchmarkOptions> = {},
  ): Promise<BenchmarkResult[]> {
    console.log("Starting benchmark with:", {
      setupCode: setupCode.length,
      implementations: implementations.map((i) => i.filename),
    });

    const runs: ImplementationRun[] = implementations.map((implementation) => ({
      id: nanoid(),
      implementationId: implementation.id,
      createdAt: Date.now(),
      status: "idle",
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

    // pre-process implementations
    const tasks = await Promise.all(
      runs.map(async (run, index) => {
        try {
          const processedCode = await bundleBenchmarkCode(run.originalCode, setupCode);
          return {
            index,
            id: run.id,
            success: true as const,
            code: processedCode,
          };
        } catch (error) {
          console.error("Error processing implementation:", error);
          return {
            index,
            id: run.id,
            success: false as const,
            error: serializeError(error).message,
          };
        }
      }),
    );

    // stop if there are any pre-processing errors
    const hasPreProcessingErrors = !tasksAreProcessed(tasks);
    if (hasPreProcessingErrors) {
      for (const task of tasks) {
        if (task.success) {
          useBenchmarkStore.getState().updateRun(runs[task.index].id, {
            status: "failed",
            error: "Cancelled due to errors in other implementations",
          });
        } else {
          useBenchmarkStore.getState().updateRun(runs[task.index].id, {
            status: "failed",
            error: task.error,
          });
        }
      }
      return [];
    }

    // setup benchmark
    const benchmateOptions = {
      ...DEFAULT_OPTIONS,
      ...runnerOptions,
      batching: { ...DEFAULT_OPTIONS.batching, ...runnerOptions?.batching },
      warmup: { ...DEFAULT_OPTIONS.warmup, ...runnerOptions?.warmup },
      quiet: true,
    };
    const runner = new Bench(benchmateOptions);
    console.log("Setting up benchmark with options:", benchmateOptions);

    // handle events
    const handleBenchmarkStart = () => {
      console.log("[benchmate] benchmarkStart");
    };
    const handleTaskStart = ({ task: id }: { task: string }) => {
      console.log(`[benchmate] taskStart: ${id}`);
      useBenchmarkStore.getState().updateRun(id, {
        status: "running",
        progress: 0,
      });
    };
    const handleTaskWarmupStart = ({ task: id, iterations }: { task: string; iterations: number }) => {
      console.log(`[benchmate] taskWarmupStart: ${id}`, { iterations });
    };
    const onProgress = ({
      task: id,
      iterationsCompleted,
      iterationsTotal,
    }: {
      task: string;
      iterationsCompleted: number;
      iterationsTotal: number;
    }) => {
      console.log(`[benchmate] progress: ${id}`, {
        iterationsCompleted,
        iterationsTotal,
      });
      useBenchmarkStore.getState().updateRun(id, {
        progress: (iterationsCompleted / iterationsTotal) * 100,
        iterations: iterationsTotal,
      });
    };
    const handleTaskComplete = (result: BenchmarkResult) => {
      const id = result.name;
      useBenchmarkStore.getState().updateRun(id, {
        status: "completed",
        progress: 100,
        result,
        elapsedTime: result.stats.time.total,
      });
    };
    const unsubscribe = () => {
      runner.off("benchmarkStart", handleBenchmarkStart);
      runner.off("taskStart", handleTaskStart);
      runner.off("taskWarmupStart", handleTaskWarmupStart);
      runner.off("progress", onProgress);
      runner.off("taskComplete", handleTaskComplete);
    };
    runner.on("benchmarkStart", handleBenchmarkStart);
    runner.on("taskStart", handleTaskStart);
    runner.on("taskWarmupStart", handleTaskWarmupStart);
    runner.on("progress", onProgress);
    runner.on("taskComplete", handleTaskComplete);

    try {
      // add tasks
      for (const task of tasks) {
        console.log(`Adding task: ${task.id}`);
        runner.add(task.id, new Function(task.code) as () => void);
      }

      // run the benchmark
      console.log("Starting benchmark run");
      const results = await runner.run();
      console.log("Benchmark complete:", results);

      unsubscribe();
      return results;
    } catch (error) {
      unsubscribe();
      console.error("Error running benchmark:", error);

      // update all running tasks to failed state
      for (const run of runs) {
        if (run.status === "running") {
          useBenchmarkStore.getState().updateRun(run.id, {
            status: "failed",
            error: serializeError(error).message,
          });
        }
      }

      throw error;
    }
  },
};
