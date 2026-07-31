#!/usr/bin/env node
// The `npm create @timedomain/acestudio-extension` entry point. Everything it does
// lives in `app.ts`; this is the wiring to a real process and a real terminal.
import { readFileSync } from "node:fs";
import { argv, cwd, exit, stderr, stdin, stdout } from "node:process";
import { createInterface } from "node:readline/promises";
import { run } from "./app.js";

const interactive = stdin.isTTY === true && stdout.isTTY === true;
const readline = interactive ? createInterface({ input: stdin, output: stdout }) : undefined;

try {
  const code = await run({
    argv: argv.slice(2),
    cwd: cwd(),
    out: (text) => void stdout.write(text),
    err: (text) => void stderr.write(text),
    interactive,
    version: version(),
    ask:
      readline === undefined
        ? undefined
        : async (question, fallback) => {
            const answer = (await readline.question(`${question} (${fallback}): `)).trim();
            return answer === "" ? fallback : answer;
          },
  });
  exit(code);
} finally {
  readline?.close();
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
