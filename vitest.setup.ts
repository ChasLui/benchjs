import { afterEach } from "vitest";

afterEach(() => {
  vi.clearAllTimers();
  vi.useRealTimers();
});

afterAll(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});
