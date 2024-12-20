import { useMemo } from "react";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { BenchmarkResult } from "@/services/benchmark/types";

export type BenchmarkStatus = "completed" | "failed" | "idle" | "running" | "warmup";

export interface BenchmarkRun {
  id: string;
  implementationId: string;
  createdAt: number;
  warmupStartedAt: number | null;
  warmupEndedAt: number | null;
  status: BenchmarkStatus;
  filename: string;
  originalCode: string;
  processedCode: string;
  progress: number;
  elapsedTime: number;
  iterations: number;
  totalIterations: number;
  error: string | null;
  result: BenchmarkResult | null;
}

interface BenchmarkState {
  // current run
  currentRunId: string | null;

  // implementation runs
  runs: Record<string, BenchmarkRun[]>; // { [implementationId]: BenchmarkRun }
  addRuns: (run: BenchmarkRun[]) => void;
  updateRun: (id: string, data: Partial<Omit<BenchmarkRun, "id">>) => void;
  removeRun: (id: string) => void;
}

export const useBenchmarkStore = create<BenchmarkState>()(
  devtools((set) => ({
    // runs
    runs: {},
    addRuns: (runs) =>
      set((state) => {
        const updatedRuns = { ...state.runs };
        for (const run of runs) {
          const updatedImplementationRuns = updatedRuns[run.implementationId] || [];
          updatedImplementationRuns.push(run);
          updatedRuns[run.implementationId] = updatedImplementationRuns;
        }
        return { runs: updatedRuns };
      }),
    updateRun: (id, data) =>
      set((state) => {
        const updatedRuns = { ...state.runs };

        // Find the implementation that contains this run
        for (const [implId, implRuns] of Object.entries(updatedRuns)) {
          const runIndex = implRuns.findIndex((run) => run.id === id);
          if (runIndex !== -1) {
            // Update the specific run
            updatedRuns[implId] = [
              ...implRuns.slice(0, runIndex),
              { ...implRuns[runIndex], ...data },
              ...implRuns.slice(runIndex + 1),
            ];
            break;
          }
        }

        return { runs: updatedRuns };
      }),
    removeRun: (id) =>
      set((state) => ({
        runs: Object.fromEntries(Object.entries(state.runs).filter(([key]) => key !== id)),
      })),
  })),
);

export const useRunsForImplementation = (implementationId: string) => {
  const store = useBenchmarkStore();
  return useMemo(() => {
    return store.runs[implementationId] || [];
  }, [implementationId, store]);
};

export const useLatestRunForImplementation = (implementationId: string) => {
  const runs = useRunsForImplementation(implementationId);
  return useMemo(() => {
    return runs[runs.length - 1] ?? null;
  }, [runs]);
};
