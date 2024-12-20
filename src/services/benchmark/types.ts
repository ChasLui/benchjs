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

export type WorkerToMainMessage =
  | {
      type: "console";
      runId: string;
      level: "debug" | "error" | "info" | "log" | "warn";
      message: string;
    }
  | {
      type: "consoleBatch";
      runId: string;
      logs: {
        level: "debug" | "error" | "info" | "log" | "warn";
        message: string;
        count: number;
      }[];
    }
  | { type: "error"; runId: string; error: string }
  | {
      type: "progress";
      runId: string;
      progress: number;
      elapsedTime: number;
      iterationsCompleted: number;
      totalIterations: number;
    }
  | { type: "result"; runId: string; result: BenchmarkResult[] }
  | { type: "warmupEnd"; runId: string }
  | { type: "warmupStart"; runId: string };
