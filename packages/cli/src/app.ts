import { readFileSync } from "node:fs";
import { parseArgs, UsageError } from "./args";
import {
  cmdLogin,
  cmdLogout,
  cmdPack,
  cmdSign,
  cmdSubmit,
  cmdVerify,
  cmdWhoami,
} from "./commands";
import { loadServiceAliases } from "./config";
import type { Ctx } from "./context";
import { defaultCredentialStore } from "./credentials/keychain";
import type { CredentialStore } from "./credentials/store";
import { ExitCode } from "./exit-codes";
import { stdioPrompter, type Prompter } from "./prompt";
import { Reporter } from "./reporter";
import { resolveService, ServiceUrlError } from "./service";

export interface RunDeps {
  argv: readonly string[];
  env: NodeJS.ProcessEnv;
  cwd: string;
  out: (text: string) => void;
  err: (text: string) => void;
  store?: CredentialStore;
  prompter?: Prompter;
  stdinIsTTY?: boolean;
  stdoutIsTTY?: boolean;
  /** Overrides where service-alias config is read from (tests). */
  configDir?: string;
}

const USAGE = `aceworkflow — pack, submit, and verify .aceworkflow bundles

Usage:
  aceworkflow pack   <dir> [-o <out.aceworkflow>]
  aceworkflow submit <bundle.aceworkflow> [-o <out>] [--ad-hoc]
  aceworkflow verify <bundle.aceworkflow> [--roots <file>]
  aceworkflow sign   <dir|bundle> [-o <out>] [--ad-hoc] [--no-verify] [--roots <file>]

  aceworkflow login  [--token <bearer> | --ad-hoc]
  aceworkflow logout
  aceworkflow whoami

Global options:
  --service <url>   target a specific signing service (default: production)
  --token <bearer>  use this credential for one command, without storing it
  --roots <file>    trust anchor for verify and sign self-verify (default: embedded)
  --json            emit a machine-readable result object on stdout
  --quiet           print only the final result or error
  -y, --yes         never prompt (assume non-interactive)
  -h, --help        show this help
  --version         print the version
`;

/** True in a CI environment. Any non-falsey CI value counts — not just "true". */
function isCI(env: NodeJS.ProcessEnv): boolean {
  const ci = env.CI;
  return ci !== undefined && ci !== "" && ci !== "0" && ci.toLowerCase() !== "false";
}

function version(): string {
  try {
    const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf-8")) as {
      version?: string;
    };
    return pkg.version ?? "0.0.0";
  } catch {
    return "0.0.0";
  }
}

/**
 * The whole CLI as one testable function: parse, resolve the target service,
 * build the command context from injected dependencies, and dispatch. Returns
 * the process exit code instead of calling `process.exit`, so tests drive it
 * directly.
 */
export async function run(deps: RunDeps): Promise<number> {
  let parsed;
  try {
    parsed = parseArgs(deps.argv);
  } catch (error) {
    if (error instanceof UsageError) {
      // Honour --json even here, before options are parsed: a machine caller
      // must get one { error, code } object on every path.
      if (deps.argv.includes("--json")) deps.out(`${JSON.stringify({ error: error.message, code: "usage" })}\n`);
      else {
        deps.err(`error: ${error.message}\n`);
        deps.err(USAGE);
      }
      return ExitCode.Usage;
    }
    throw error;
  }
  const { command, positionals, options } = parsed;

  if (options.version) {
    deps.out(`${version()}\n`);
    return ExitCode.Success;
  }
  if (options.help || command === "help") {
    deps.out(USAGE);
    return ExitCode.Success;
  }
  if (command === null) {
    if (options.json) deps.out(`${JSON.stringify({ error: "no command given", code: "usage" })}\n`);
    else deps.err(USAGE);
    return ExitCode.Usage;
  }

  const reporter = new Reporter({ json: options.json, quiet: options.quiet }, { out: deps.out, err: deps.err });

  // Only read the config file when there is an override to resolve — the
  // default (production) path touches no disk.
  const hasOverride = options.service !== undefined || (deps.env.ACEWORKFLOW_SERVICE ?? "").length > 0;
  const aliases = hasOverride ? await loadServiceAliases(deps.configDir) : {};

  let service;
  try {
    service = resolveService({ flag: options.service, env: deps.env, aliases });
  } catch (error) {
    if (error instanceof ServiceUrlError) {
      reporter.failure(error.message, "usage");
      return ExitCode.Usage;
    }
    throw error;
  }
  // A service override is a safety-relevant fact: announce it on stderr on
  // every path — even under --json (which governs stdout) and --quiet — so a
  // command can never quietly hit a non-production backend.
  if (service.overridden) {
    const via = service.alias !== undefined ? `${service.alias} → ` : "";
    deps.err(`service: ${via}${service.url.origin} (overridden)\n`);
  }

  const interactive =
    (deps.stdinIsTTY ?? false) && (deps.stdoutIsTTY ?? false) && !options.yes && !isCI(deps.env);

  const ctx: Ctx = {
    options,
    positionals,
    service,
    reporter,
    store: deps.store ?? defaultCredentialStore(deps.env),
    env: deps.env,
    cwd: deps.cwd,
    interactive,
    prompter: deps.prompter ?? stdioPrompter(),
  };

  try {
    switch (command) {
      case "pack":
        return await cmdPack(ctx);
      case "submit":
        return await cmdSubmit(ctx);
      case "verify":
        return await cmdVerify(ctx);
      case "sign":
        return await cmdSign(ctx);
      case "login":
        return await cmdLogin(ctx);
      case "logout":
        return await cmdLogout(ctx);
      case "whoami":
        return await cmdWhoami(ctx);
      default:
        reporter.failure(`unknown command: ${command}`, "usage");
        deps.err(USAGE);
        return ExitCode.Usage;
    }
  } catch (error) {
    reporter.failure(error instanceof Error ? error.message : String(error), "unexpected");
    return ExitCode.Generic;
  }
}
