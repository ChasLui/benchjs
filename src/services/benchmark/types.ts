import { BenchmarkOptions } from "benchmate";

// benchmark types
export type BenchmarkResult = {
  name: string;
  stats: {
    samples: number;
    batches: number;
    time: {
      total: number;
      min: number;
      max: number;
      average: number;
      percentile50: number;
      percentile90: number;
      percentile95: number;
    };
    opsPerSecond: {
      average: number;
      max: number;
      min: number;
      margin: number;
    };
  };
};

// worker messages
export type MainToWorkerMessage =
  | {
      type: "cancelRun";
      runId: string;
    }
  | {
      type: "startRuns";
      runs: {
        runId: string;
        processedCode: string;
      }[];
      options?: BenchmarkOptions;
    };

export type ConsoleLevel = "debug" | "error" | "info" | "log" | "warn";

export type WorkerToMainMessage =
  | {
      type: "consoleBatch";
      runId: string;
      logs: {
        level: ConsoleLevel;
        message: string;
        count: number;
      }[];
    }
  | { type: "error"; runId: string; error: string }
  | {
      type: "progress";
      runId: string;
      elapsedTime: number;
      iterationsCompleted: number;
      progress: number;
      totalIterations: number;
    }
  | { type: "result"; runId: string; result: BenchmarkResult[] }
  | { type: "setup"; runId: string }
  | { type: "taskComplete"; runId: string }
  | { type: "taskStart"; runId: string }
  | { type: "teardown"; runId: string }
  | { type: "warmupEnd"; runId: string }
  | { type: "warmupStart"; runId: string };
