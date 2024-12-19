export interface BenchmarkTask {
  name: string;
  code: string;
}

export interface BenchmarkResult {
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
}

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

export interface BenchmarkRunner {
  run: (tasks: BenchmarkTask[], options?: Partial<BenchmarkOptions>) => Promise<BenchmarkResult[]>;
}

export class BenchmarkError extends Error {
  readonly code: "EXECUTION_ERROR" | "INVALID_CODE" | "MISSING_EXPORT";
  readonly details?: unknown;

  constructor(
    code: "EXECUTION_ERROR" | "INVALID_CODE" | "MISSING_EXPORT",
    message: string,
    details?: unknown,
  ) {
    super(message);
    this.name = "BenchmarkError";
    this.code = code;
    this.details = details;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BenchmarkError);
    }
  }
}
