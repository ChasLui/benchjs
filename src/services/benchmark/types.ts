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

export interface BenchmarkTask {
  id: string;
  code: string;
}
