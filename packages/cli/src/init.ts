/**
 * `init` — the second door onto the scaffolder (ADR 0113 §7).
 *
 * `npm create @timedomain/acestudio-workflow-extension` stays the canonical
 * getting-started spelling, because it is the one that works before anything is
 * installed. This is the same act under the name already on `PATH`, for someone who
 * has the toolchain and looks for "how do I start one" in `aceworkflow --help`.
 *
 * One implementation, two doors: the tree comes from the initializer's own
 * `scaffold()`, called in-process. Never a shell-out to `npm create` — a subprocess
 * would go back to the registry and re-resolve `@latest`, so a CLI at one version
 * could scaffold from templates at another. The direct call is version-locked by the
 * lockfile. The dependency points this way only: nothing in the initializer knows
 * about this package, which is what keeps the native keychain binding off the
 * `npm create` path.
 *
 * `init` means exactly one thing: make a new project. It must never sniff the
 * directory and switch to configuring what it finds — that overload is what forced
 * `wrangler init`'s deprecation. In-place configuration, if ever wanted, is its own
 * verb.
 *
 * The imported surface is checked by this repo's typecheck rather than by an
 * api-extractor report: the initializer ships as an executable with no declaration
 * emit, and in-repo the import resolves through the `acestudio:source` condition
 * straight to its TypeScript source. So an incompatible change to `scaffold()` fails
 * `npm run typecheck` in the commit that makes it, and the two packages are siblings
 * on one release train that cannot drift. Giving the initializer a `types` entry to
 * put it under the report would advertise a library surface the package does not mean
 * to offer.
 */

import { relative, resolve } from "node:path";
import { defaultsFor, scaffold, ScaffoldError } from "@timedomain/create-acestudio-workflow-extension";
import type { Ctx } from "./context";
import { ExitCode } from "./exit-codes";

/** What a caller with a terminal is offered when they name no directory. */
const DEFAULT_DIRECTORY = "my-extension";

export const INIT_USAGE = `aceworkflow init — scaffold a new ACE Studio workflow extension

Usage:
  aceworkflow init [directory] [options]

Options:
  --id <developer.extension>  the extension id, two lowercase slugs joined by a dot
  --name <text>               the name ACE Studio shows the user
  --publisher <text>          who publishes it, shown beside the name
  --description <text>        one line for the install dialog
  -y, --yes                   take the defaults; never prompt
  --json                      emit the directory and file list as one result object
  -h, --help                  show this help

Anything not given is asked for, or derived from the directory name when there is no
terminal to ask in — where the directory itself defaults to my-extension. It must be
an empty or missing directory either way.

The same scaffolder, called in-process — no network and no subprocess — as the
canonical getting-started spelling:

  npm create @timedomain/acestudio-workflow-extension@latest [directory]
`;

/**
 * Scaffold a new extension. Everything the tree contains is the initializer's; what
 * is this binary's own is the argument surface around it, and the
 * non-interactive contract every verb here shares (ADR 0113 §6).
 */
export async function cmdInit(ctx: Ctx): Promise<number> {
  // One question, asked or answered by its own default — there is no third state.
  // Handing the default back when there is nobody to ask is what makes the
  // interactive and non-interactive paths agree on the result.
  const ask = async (question: string, fallback: string): Promise<string> => {
    if (!ctx.interactive) return fallback;
    const answer = await ctx.prompter.line(`${question} (${fallback}): `);
    return answer.length === 0 ? fallback : answer;
  };

  // A second directory is a usage error rather than something quietly dropped — the
  // initializer's rule, and this parser collects every bare token, so nothing else
  // would notice the extra one.
  if (ctx.positionals.length > 1) {
    ctx.reporter.failure(`unexpected argument: ${ctx.positionals[1] as string} (one directory, please)`, "usage");
    return ExitCode.Usage;
  }

  const named = ctx.positionals[0] ?? "";
  const directory = resolve(ctx.cwd, named.length > 0 ? named : await ask("Directory", DEFAULT_DIRECTORY));
  // Derived from the directory once it is settled, so what is offered follows the
  // answer just given rather than the default it replaced.
  const offered = defaultsFor(directory, ctx.options.publisher);
  const publisher = ctx.options.publisher ?? (await ask("Publisher", offered.publisher));
  const name = ctx.options.name ?? (await ask("Display name", offered.name));
  // Re-derived once more: the developer slug comes from the publisher, which a prompt
  // may only just have settled.
  const id = ctx.options.id ?? (await ask("Extension id", defaultsFor(directory, publisher).id));
  const description = ctx.options.description ?? (await ask("Description", `${name} for ACE Studio`));

  let result;
  try {
    result = await scaffold({ directory, id, name, publisher, description });
  } catch (error) {
    // The initializer's refusals reach the user as they are — one behaviour and one
    // message, whichever door was used.
    //
    // Generic, not the 7 of §6's "manifest / id / version / display-name validation",
    // even for a malformed `--id`: 7's neighbours in that table are all verdicts the
    // service returned on a submission, and every refusal this binary reaches on its
    // own — `pack` on a manifest it cannot read an id out of included — is a Generic
    // with a `code` string that says which. Splitting an id refusal out from a
    // non-empty-directory one would also need the initializer to discriminate its
    // errors, and this is the exit code its own bin already gives both.
    if (error instanceof ScaffoldError) {
      ctx.reporter.failure(error.message, "scaffold-refused");
      return ExitCode.Generic;
    }
    throw error;
  }

  const where = relative(ctx.cwd, result.directory) || ".";
  ctx.reporter.step(`✓ scaffolded    ${String(result.files.length)} files into ${where}`);
  // Named rather than spelled as a pasteable `cd …`, which would want this package to
  // export its shell quoting for the sake of one line of guidance.
  ctx.reporter.step(`→ next          npm install && npm run check, in ${where}`);
  ctx.reporter.step(`  then read AGENTS.md — the whole build/load/observe/debug loop, written for a code agent`);
  ctx.reporter.result(`scaffolded ${String(result.files.length)} files into ${where}`, {
    command: "init",
    directory: result.directory,
    files: result.files,
  });
  return ExitCode.Success;
}
