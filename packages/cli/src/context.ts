import type { CliOptions } from "./args";
import type { CredentialStore } from "./credentials/store";
import type { Prompter } from "./prompt";
import type { Reporter } from "./reporter";
import type { ResolvedService } from "./service";

/** Everything a command needs, injected so the whole CLI is testable. */
export interface Ctx {
  options: CliOptions;
  positionals: string[];
  service: ResolvedService;
  reporter: Reporter;
  store: CredentialStore;
  env: NodeJS.ProcessEnv;
  cwd: string;
  /** A real interactive TTY where prompting is allowed (not `-y`, not CI). */
  interactive: boolean;
  /** Overrides where the trust-registry cache is kept (tests). */
  appDataDir?: string;
  prompter: Prompter;
}
