import { Bench } from "benchmate";
import { BenchmarkOptions, BenchmarkResult, BenchmarkRunner, BenchmarkTask } from "./types";

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

export class BenchmateRunner implements BenchmarkRunner {
  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  async run(tasks: BenchmarkTask[], options?: Partial<BenchmarkOptions>): Promise<BenchmarkResult[]> {
    console.log("Running benchmark with options:", options);
    const mergedOptions = {
      ...DEFAULT_OPTIONS,
      ...options,
      batching: {
        ...DEFAULT_OPTIONS.batching,
        ...options?.batching,
      },
      warmup: {
        ...DEFAULT_OPTIONS.warmup,
        ...options?.warmup,
      },
    };

    const bench = new Bench(mergedOptions);

    for (const task of tasks) {
      console.log(`Adding task: ${task.name}`);
      bench.add(task.name, new Function(task.code) as () => void);
    }

    console.log("Starting benchmark run");
    const results = await bench.run();
    console.log("Benchmark complete:", results);
    return results;
  }
}
