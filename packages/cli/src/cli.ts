#!/usr/bin/env node
import { argv, cwd, env, exit, stderr, stdin, stdout } from "node:process";
import { run } from "./app";

const code = await run({
  argv: argv.slice(2),
  env,
  cwd: cwd(),
  out: (text) => void stdout.write(text),
  err: (text) => void stderr.write(text),
  stdinIsTTY: stdin.isTTY === true,
  stdoutIsTTY: stdout.isTTY === true,
});

exit(code);
