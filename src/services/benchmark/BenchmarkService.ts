import { bundleBenchmarkCode } from "../code-processor/bundle-benchmark-code";
import { BenchmarkOptions, BenchmarkResult, BenchmarkRunner, BenchmarkTask } from "./types";

interface ImplementationFile {
  filename: string;
  content: string;
}

export class BenchmarkService {
  runner: BenchmarkRunner;

  constructor(runner: BenchmarkRunner) {
    this.runner = runner;
  }

  public async runBenchmark(
    setupCode: string,
    implementations: ImplementationFile[],
    runnerOptions: Partial<BenchmarkOptions> = {},
  ): Promise<BenchmarkResult[]> {
    console.log("Starting benchmark with:", {
      setupCode: setupCode.length,
      implementations: implementations.map((i) => i.filename),
    });

    try {
      // Process each implementation with the code processor
      const tasks = await Promise.all(
        implementations.map(async (impl): Promise<BenchmarkTask> => {
          const processedCode = await bundleBenchmarkCode(impl.content, setupCode);
          return {
            name: impl.filename,
            code: processedCode,
          };
        }),
      );

      // Run the benchmark
      const results = await this.runner.run(tasks, runnerOptions);
      console.log("Benchmark complete:", results);
      return results;
    } catch (error_) {
      const error = error_ instanceof Error ? error_ : new Error(String(error_));
      console.error("Error running benchmark:", error);
      throw error;
    }
  }
}
