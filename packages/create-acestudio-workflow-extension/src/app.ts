/**
 * The scaffolder's command line: parse, ask what was not given, scaffold, and say
 * what to do next.
 *
 * @remarks
 * `run` returns the exit code instead of taking it, and reads its world out of the
 * dependencies it is handed, so the whole command line is drivable from a test with
 * no process to spawn and no terminal to fake.
 */

import { relative, resolve } from "node:path";
import { defaultsFor, scaffold, ScaffoldError } from "./index.js";

/** Where a directory is scaffolded when the caller names none. */
const DEFAULT_DIRECTORY = "my-extension";

/** What the process exits with. */
const EXIT = { scaffolded: 0, refused: 1, usage: 2 } as const;

// Both invocations are spelled out because npm's `--` is not this parser's: npm eats
// the first one and forwards the rest, while a `--` that does reach the parser means
// what it means everywhere else — the tokens after it are not options.
const USAGE = `create-acestudio-workflow-extension — scaffold an ACE Studio workflow extension

Usage:
  npm create @timedomain/acestudio-workflow-extension@latest [directory]
  npm create @timedomain/acestudio-workflow-extension@latest -- [directory] [options]
  npx create-acestudio-workflow-extension [directory] [options]

Options:
  --id <developer.extension>  the extension id, two lowercase slugs joined by a dot
  --name <text>               the name ACE Studio shows the user
  --publisher <text>          who publishes it, shown beside the name
  --description <text>        one line for the install dialog
  -y, --yes                   take the defaults; never prompt
  -h, --help                  show this help
  --version                   print the version

Everything not given is asked for, or derived from the directory name when there is
no terminal to ask in.
`;

/** How the command line reaches the world outside it. */
export interface RunDeps {
  /** The arguments after the program name. */
  readonly argv: readonly string[];
  /** Where relative directories resolve from. */
  readonly cwd: string;
  readonly out: (text: string) => void;
  readonly err: (text: string) => void;
  /**
   * Asks one question and returns the answer, or the fallback when it is blank.
   *
   * Its presence *is* "there is somebody there to ask": a caller with no terminal —
   * or one told `--yes` — passes nothing, and every question takes its default. A
   * separate `interactive` flag beside it would only make the two disagree.
   */
  readonly ask?: (question: string, fallback: string) => Promise<string>;
  /** This package's version, for `--version`. */
  readonly version?: string;
}

/** What `parse` understood, before anything is asked for or derived. */
interface ParsedArgs {
  readonly directory?: string;
  readonly id?: string;
  readonly name?: string;
  readonly publisher?: string;
  readonly description?: string;
  readonly yes: boolean;
  readonly help: boolean;
  readonly version: boolean;
}

class UsageError extends Error {}

/**
 * Run the scaffolder. Returns the process exit code: `0` scaffolded (or printed what
 * was asked for), `1` refused, `2` was called wrong.
 */
export async function run(deps: RunDeps): Promise<number> {
  let args: ParsedArgs;
  try {
    args = parse(deps.argv);
  } catch (error) {
    // Only a usage error is the caller's fault. Anything else is this program's, and
    // dressing a bug up as "you typed it wrong" sends the reader after the wrong thing.
    if (!(error instanceof UsageError)) throw error;
    deps.err(`error: ${error.message}\n\n`);
    deps.err(USAGE);
    return EXIT.usage;
  }

  if (args.help) {
    deps.out(USAGE);
    return EXIT.scaffolded;
  }
  if (args.version) {
    deps.out(`${deps.version ?? "0.0.0"}\n`);
    return EXIT.scaffolded;
  }

  const ask = args.yes || deps.ask === undefined ? async (_question: string, fallback: string) => fallback : deps.ask;

  const directoryName = args.directory ?? (await ask("Directory", DEFAULT_DIRECTORY));
  const directory = resolve(deps.cwd, directoryName);
  // Derived from the directory *after* it is settled, so the offered id and name
  // follow the answer just given rather than the default that was replaced.
  const suggested = defaultsFor(directory, args.publisher);
  const publisher = args.publisher ?? (await ask("Publisher", suggested.publisher));
  const name = args.name ?? (await ask("Display name", suggested.name));
  // Re-derived once more: a publisher answered at the prompt is what the developer
  // slug should come from, and it was not known when `suggested` was built.
  const id = args.id ?? (await ask("Extension id", defaultsFor(directory, publisher).id));
  const description = args.description ?? (await ask("Description", `${name} for ACE Studio`));

  try {
    const result = await scaffold({ directory, id, name, publisher, description });
    report(deps, result.directory, result.files.length);
    return EXIT.scaffolded;
  } catch (error) {
    if (error instanceof ScaffoldError) {
      deps.err(`error: ${error.message}\n`);
      return EXIT.refused;
    }
    throw error;
  }
}

/**
 * A path as the reader can paste it. Quoted only when a shell would otherwise split it or
 * read something into it, so the ordinary case stays the bare name it was typed as.
 */
function shellArgument(path: string): string {
  return /^[\w./-]+$/.test(path) ? path : `'${path.replaceAll("'", `'\\''`)}'`;
}

function report(deps: RunDeps, directory: string, fileCount: number): void {
  const where = relative(deps.cwd, directory) || ".";
  deps.out(`Scaffolded ${String(fileCount)} files into ${where}\n\n`);
  deps.out("Next:\n");
  deps.out(`  cd ${shellArgument(where)}\n`);
  deps.out("  npm install\n");
  deps.out("  npm run check     # typecheck + build, with no ACE Studio running\n\n");
  deps.out("Then read AGENTS.md — it is the whole build/load/observe/debug loop, and\n");
  deps.out("it is written for a code agent to follow.\n");
}

/**
 * A small hand-rolled parser — no dependency for a handful of flags, matching the
 * `aceworkflow` CLI beside it. Supports `--flag value`, `--flag=value`, `-y`, and `--`
 * to end option parsing, after which a token is a directory even if it starts with a
 * dash. The first bare token is the directory; a second is a usage error rather than
 * something quietly ignored.
 */
function parse(argv: readonly string[]): ParsedArgs {
  const parsed: {
    -readonly [K in keyof ParsedArgs]: ParsedArgs[K];
  } = { yes: false, help: false, version: false };

  for (let i = 0; i < argv.length; i += 1) {
    let arg = argv[i] as string;

    if (arg === "--") {
      for (const rest of argv.slice(i + 1)) takeDirectory(parsed, rest);
      break;
    }
    if (!arg.startsWith("-") || arg === "-") {
      takeDirectory(parsed, arg);
      continue;
    }

    let inline: string | undefined;
    const equals = arg.indexOf("=");
    if (equals !== -1) {
      inline = arg.slice(equals + 1);
      arg = arg.slice(0, equals);
    }
    const value = (): string => {
      const given = inline ?? argv[++i];
      if (given === undefined) throw new UsageError(`${arg} needs a value`);
      return given;
    };
    const flag = (): true => {
      if (inline !== undefined) throw new UsageError(`${arg} takes no value`);
      return true;
    };

    switch (arg) {
      case "--id":
        parsed.id = value();
        break;
      case "--name":
        parsed.name = value();
        break;
      case "--publisher":
        parsed.publisher = value();
        break;
      case "--description":
        parsed.description = value();
        break;
      case "-y":
      case "--yes":
        parsed.yes = flag();
        break;
      case "-h":
      case "--help":
        parsed.help = flag();
        break;
      case "--version":
        parsed.version = flag();
        break;
      default:
        throw new UsageError(`unknown option: ${arg}`);
    }
  }

  return parsed;
}

function takeDirectory(parsed: { directory?: string }, token: string): void {
  if (parsed.directory !== undefined) {
    throw new UsageError(`unexpected argument: ${token} (one directory, please)`);
  }
  parsed.directory = token;
}
