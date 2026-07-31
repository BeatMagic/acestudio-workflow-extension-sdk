#!/usr/bin/env node
// The `npm create @timedomain/acestudio-extension` entry point. Everything it does
// lives in `app.ts`; this is the wiring to a real process and a real terminal.
import { readFileSync } from "node:fs";
import { argv, cwd, env, exit, stderr, stdin, stdout } from "node:process";
import { createInterface } from "node:readline/promises";
import { run } from "./app.js";

// A CI runner with a TTY allocated would otherwise sit at the first prompt until the
// job times out, which is the one failure mode a scaffolder must not have.
const readline = stdin.isTTY === true && stdout.isTTY === true && !isCI() ? createInterface({ input: stdin, output: stdout }) : undefined;

let code: number;
try {
  code = await run({
    argv: argv.slice(2),
    cwd: cwd(),
    out: (text) => void stdout.write(text),
    err: (text) => void stderr.write(text),
    version: version(),
    ask:
      readline === undefined
        ? undefined
        : async (question, fallback) => {
            const answer = (await readline.question(`${question} (${fallback}): `)).trim();
            return answer === "" ? fallback : answer;
          },
  });
} finally {
  // Before the exit below, which does not run `finally` blocks: an open readline keeps
  // the terminal in its raw-ish state.
  readline?.close();
}

exit(code);

/** True in a CI environment. Any non-falsey `CI` counts — not just "true". */
function isCI(): boolean {
  const ci = env.CI;
  return ci !== undefined && ci !== "" && ci !== "0" && ci.toLowerCase() !== "false";
}

function version(): string {
  try {
    const manifest = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8")) as {
      version?: string;
    };
    return manifest.version ?? "0.0.0";
  } catch {
    return "0.0.0";
  }
}
