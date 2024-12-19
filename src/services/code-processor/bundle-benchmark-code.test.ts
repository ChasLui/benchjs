import { format } from "@/services/code-processor/prettier";
import { bundleBenchmarkCode } from "./bundle-benchmark-code";

describe("bundleBenchmarkCode", () => {
  describe("named export transformations", () => {
    // assignment to arrow function
    it("should transform named run arrow function export", async () => {
      const code = `export const run = () => { return 42; }`;
      const result = await bundleBenchmarkCode(code, "");

      expect(result).toBe(await format(`return function run() { return 42; }`));
    });

    it("should transform named run arrow function export with implicit return", async () => {
      const code = `export const run = () => 42`;
      const result = await bundleBenchmarkCode(code, "");

      expect(result).toBe(
        await format(`
        return function run() { return (42); }
      `),
      );
    });

    it("should transform async named export arrow function", async () => {
      const code = `export const run = async () => { return 42; }`;
      const result = await bundleBenchmarkCode(code, "");

      expect(result).toBe(
        await format(`
        return async function run() { return 42; }
      `),
      );
    });

    // assignment to function expression
    it("should transform named run function export", async () => {
      const code = `export const run = function() { return 42; }`;
      const result = await bundleBenchmarkCode(code, "");

      expect(result).toBe(
        await format(`
        return function run() { return 42; }
      `),
      );
    });

    it("should transform named run function export with implicit return", async () => {
      const code = `export const run = function() { return 42; }`;
      const result = await bundleBenchmarkCode(code, "");

      expect(result).toBe(
        await format(`
        return function run() { return (42); }
      `),
      );
    });

    it("should transform async named export function", async () => {
      const code = `export const run = async function() { return 42; }`;
      const result = await bundleBenchmarkCode(code, "");

      expect(result).toBe(
        await format(`
        return async function run() { return 42; }
      `),
      );
    });

    // function declaration
    it("should transform named run function declaration", async () => {
      const code = `export function run() { return 42; }`;
      const result = await bundleBenchmarkCode(code, "");

      expect(result).toBe(
        await format(`
        return function run() { return 42; }
      `),
      );
    });

    it("should transform async named export function declaration", async () => {
      const code = `export async function run() { return 42; }`;
      const result = await bundleBenchmarkCode(code, "");

      expect(result).toBe(
        await format(`
        return async function run() { return 42; }
      `),
      );
    });
  });

  describe("default export transformations", () => {
    // arrow function
    it("should transform default export arrow function", async () => {
      const code = `export default () => { return 42; }`;
      const result = await bundleBenchmarkCode(code, "");

      expect(result).toBe(
        await format(`
        return function run() { return 42; }
      `),
      );
    });

    it("should transform default export arrow function with implicit return", async () => {
      const code = `export default () => 42`;
      const result = await bundleBenchmarkCode(code, "");

      expect(result).toBe(
        await format(`
        return function run() { return (42); }
      `),
      );
    });

    it("should transform async default export arrow function", async () => {
      const code = `export default async () => { return 42; }`;
      const result = await bundleBenchmarkCode(code, "");

      expect(result).toBe(
        await format(`
        return async function run() { return 42; }
      `),
      );
    });

    // function expression
    it("should transform default export function expression", async () => {
      const code = `export default function() { return 42; }`;
      const result = await bundleBenchmarkCode(code, "");

      expect(result).toBe(
        await format(`
        return function run() { return 42; }
      `),
      );
    });

    it("should transform async default export function expression", async () => {
      const code = `export default async function() { return 42; }`;
      const result = await bundleBenchmarkCode(code, "");

      expect(result).toBe(
        await format(`
        return async function run() { return 42; }
      `),
      );
    });

    // named function expression
    it("should transform default export named function expression", async () => {
      const code = `export default function test() { return 42; }`;
      const result = await bundleBenchmarkCode(code, "");

      expect(result).toBe(
        await format(`
        return function run() { return 42; }
      `),
      );
    });

    it("should transform async default export named function expression", async () => {
      const code = `export default async function test() { return 42; }`;
      const result = await bundleBenchmarkCode(code, "");

      expect(result).toBe(
        await format(`
        return async function run() { return 42; }
      `),
      );
    });
  });

  describe("strip exports plugin", () => {
    it("should strip named exports with declarations", async () => {
      const code = `
        export const value = 42;
        export const run = () => value;
      `;
      const result = await bundleBenchmarkCode(code, "");

      expect(result).toBe(
        await format(`
        const value = 42;
        return function run() { return value; }
      `),
      );
    });

    it("should strip named exports without declarations", async () => {
      const code = `
        const value = 42;
        export { value };
        export const run = () => value;
      `;
      const result = await bundleBenchmarkCode(code, "");

      expect(result).toBe(
        await format(`
        const value = 42;
        return function run() { return value; }
      `),
      );
    });

    it("should strip multiple named exports", async () => {
      const code = `
        export const a = 1;
        export const b = 2;
        export const c = 3;
        export const run = () => a + b + c;
      `;
      const result = await bundleBenchmarkCode(code, "");

      expect(result).toBe(
        await format(`
        const a = 1;
        const b = 2;
        const c = 3;
        return function run() { return a + b + c; }
      `),
      );
    });

    it("should strip mixed named exports and declarations", async () => {
      const code = `
        const a = 1;
        export { a };
        export const b = 2;
        const c = 3;
        export { c as d };
        export const run = () => a + b + c;
      `;
      const result = await bundleBenchmarkCode(code, "");

      expect(result).toBe(
        await format(`
        const a = 1;

        const b = 2;
        const c = 3;
        return function run() { return a + b + c; }
      `),
      );
    });

    it("should strip type exports", async () => {
      const code = `
        export type Value = number;
        export interface IValue { value: number }
        export const value = 42;
        export const run = () => value;
      `;
      const result = await bundleBenchmarkCode(code, "");

      expect(result).toBe(
        await format(`
        const value = 42;
        return function run() { return value; }
      `),
      );
    });
  });
});
