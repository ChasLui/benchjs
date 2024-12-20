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

export type BenchmarkOptions = ({ iterations: number } | { iterations?: "auto"; time: number }) & {
  batching?: {
    enabled: boolean;
    size: "auto" | number;
  };
  warmup?: {
    enabled: boolean;
    iterations: "auto" | number;
  };
  method?: "auto" | "hrtime" | "performance.now";
  quiet?: boolean;
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
      type: "error";
      runId: string;
      error: string;
    }
  | {
      type: "progress";
      runId: string;
      progress: number;
      iterationsCompleted: number;
      totalIterations: number;
      elapsedTime: number;
    }
  | {
      type: "result";
      runId: string;
      result: BenchmarkResult[];
    }
  | {
      type: "warmupEnd";
      runId: string;
    }
  | {
      type: "warmupStart";
      runId: string;
    };
