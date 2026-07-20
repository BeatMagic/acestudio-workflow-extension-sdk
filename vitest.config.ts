import { defineConfig } from "vitest/config";

// Plain-Node workspace packages: the signed-JSON crypto core, the wire
// schemas, and the reference verifier. Each package's tests live under its
// own test/ directory.
export default defineConfig({
  test: {
    name: "packages",
    environment: "node",
    include: ["packages/*/test/**/*.test.ts"],
  },
});
