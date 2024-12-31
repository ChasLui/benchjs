# BenchJS

A browser-based JavaScript benchmarking tool: https://benchjs.com
\
Currently powered by [benchmate](https://github.com/3rd/benchmate).

## Features

- 🚀 **Zero Setup Required** - Write and run benchmarks directly in your browser
- 📊 **Real-time Metrics** - Watch your benchmarks run with detailed performance statistics
- 🔄 **Easy Comparison** - Compare multiple implementations at once
- 📋 **Modern experience** - TypeScript, Monaco, esbuild, all the goodies
- 📦 **ESM Package Support** - Import packages directly via [esm.sh](https://esm.sh)
- 🔗 **Shareable Results** - Share an URL to your benchmarks or an image of the results

## Writing Benchmarks

### File Structure

- `setup.ts`: Setup code and shared utilities
- `implementations/*.ts`: Implementation files containing benchmark code

### Setup File

The setup file (`setup.ts`) is where you prepare data and create shared helpers. Everything you export will be available as a global for each implementation.

```typescript
// Generate test data
export const generateData = (size: number) => {
  return Array.from({ length: size }, (_, i) => i);
};

// Export data and helpers
export const data = generateData(1000);
export const sum = (a: number, b: number) => a + b;
```

### Implementation Files

Each implementation file must export a `run` function that contains the code you want to benchmark.

```typescript
export const run = () => {
  // Your implementation here
  return data.reduce(sum, 0);
};
```

### Using External Packages

BenchJS supports importing packages from [esm.sh](https://esm.sh). Configure them on the settings page and then import them:

```typescript
import { pick } from "lodash-es";

export const run = () => {
  return pick(data, ["id", "name"]);
};
```
