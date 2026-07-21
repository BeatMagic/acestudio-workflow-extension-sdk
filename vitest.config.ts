import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Plain-Node workspace packages: the signed-JSON crypto core, the wire
// schemas, and the reference verifier. Each package's tests live under its
// own test/ directory. Cross-package imports resolve to source (not built
// dist/) so tests run against the working tree — the same role the packages'
// "development" export condition plays for tsc and the bundler.
const source = (dir: string) => fileURLToPath(new URL(`./packages/${dir}/src/index.ts`, import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@timedomain/workflowext-signed-json": source("signed-json"),
      "@timedomain/workflowext-wire-schemas": source("wire-schemas"),
      "@timedomain/workflowext-verifier": source("reference-verifier"),
    },
  },
  test: {
    name: "packages",
    environment: "node",
    include: ["packages/*/test/**/*.test.ts"],
  },
});
