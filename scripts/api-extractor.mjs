// Runs api-extractor over every public library package, checking each package's
// committed API report (etc/<name>.api.md) against its freshly built d.ts.
//
//   npm run api:check    fail if a report is stale (CI drift gate)
//   npm run api:update   rewrite the reports to accept an intended change
//
// The reports read dist/src/index.d.ts, so `npm run build` must run first.
import { execFileSync } from "node:child_process";
import { abs, LIBRARY_PACKAGES } from "./_lib.mjs";

const local = process.argv.includes("--local");
const apiExtractor = abs("node_modules/@microsoft/api-extractor/bin/api-extractor");

for (const dir of LIBRARY_PACKAGES) {
  const args = ["run", "--verbose", "--config", abs(`${dir}/api-extractor.json`)];
  if (local) args.push("--local");
  execFileSync(process.execPath, [apiExtractor, ...args], { stdio: "inherit" });
}
