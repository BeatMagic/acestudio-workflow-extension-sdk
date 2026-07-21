export class UsageError extends Error {}

export interface CliOptions {
  service?: string;
  out?: string;
  roots?: string;
  token?: string;
  json: boolean;
  quiet: boolean;
  yes: boolean;
  adHoc: boolean;
  noVerify: boolean;
  help: boolean;
  version: boolean;
}

export interface ParsedArgs {
  command: string | null;
  positionals: string[];
  options: CliOptions;
}

function defaults(): CliOptions {
  return { json: false, quiet: false, yes: false, adHoc: false, noVerify: false, help: false, version: false };
}

/**
 * A small hand-rolled parser — no dependency for a handful of flags. Supports
 * `--flag value`, `--flag=value`, short `-o value`/`-y`, and `--` to end
 * option parsing. The first bare token is the command; the rest are
 * positionals. Unknown options, missing values, and values on boolean flags
 * are usage errors.
 */
export function parseArgs(argv: readonly string[]): ParsedArgs {
  const options = defaults();
  const positionals: string[] = [];
  let command: string | null = null;

  for (let i = 0; i < argv.length; i += 1) {
    let arg = argv[i]!;

    if (arg === "--") {
      positionals.push(...argv.slice(i + 1));
      break;
    }

    if (!arg.startsWith("-") || arg === "-") {
      if (command === null) command = arg;
      else positionals.push(arg);
      continue;
    }

    let inline: string | undefined;
    const eq = arg.indexOf("=");
    if (eq !== -1) {
      inline = arg.slice(eq + 1);
      arg = arg.slice(0, eq);
    }
    const takeValue = (): string => {
      if (inline !== undefined) return inline;
      const value = argv[i + 1];
      if (value === undefined) throw new UsageError(`${arg} requires a value`);
      i += 1;
      return value;
    };
    const noValue = (): void => {
      if (inline !== undefined) throw new UsageError(`${arg} takes no value`);
    };

    switch (arg) {
      case "--service":
        options.service = takeValue();
        break;
      case "-o":
      case "--out":
        options.out = takeValue();
        break;
      case "--roots":
        options.roots = takeValue();
        break;
      case "--token":
        options.token = takeValue();
        break;
      case "--json":
        noValue();
        options.json = true;
        break;
      case "--quiet":
        noValue();
        options.quiet = true;
        break;
      case "-y":
      case "--yes":
        noValue();
        options.yes = true;
        break;
      case "--ad-hoc":
        noValue();
        options.adHoc = true;
        break;
      case "--no-verify":
        noValue();
        options.noVerify = true;
        break;
      case "-h":
      case "--help":
        noValue();
        options.help = true;
        break;
      case "--version":
        noValue();
        options.version = true;
        break;
      default:
        throw new UsageError(`unknown option: ${arg}`);
    }
  }

  return { command, positionals, options };
}
