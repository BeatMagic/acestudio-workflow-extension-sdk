import { defaultServerConditions } from "vite";
import { defineConfig } from "vitest/config";

// Cross-package imports resolve to TypeScript source through the packages'
// "acestudio:source" export condition — the same entry tsc (customConditions)
// and esbuild (conditions) use. Vitest's node environment reads
// `ssr.resolve.conditions`, and on Vite 6+ setting conditions replaces the
// defaults, so they are spread back in.
export default defineConfig({
  ssr: {
    resolve: {
      conditions: ["acestudio:source", ...defaultServerConditions],
    },
  },
  test: {
    name: "packages",
    environment: "node",
    include: ["packages/*/test/**/*.test.ts"],
  },
});
