import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, expect, test } from "vitest";
import { run, type RunDeps } from "../src/app.js";

/** One root for the file's temp directories, so nothing is left in $TMPDIR after a run. */
const root = mkdtempSync(join(tmpdir(), "create-ace-cli-"));
let taken = 0;

afterAll(() => {
  rmSync(root, { recursive: true, force: true });
});

interface Session {
  readonly code: number;
  readonly out: string;
  readonly err: string;
  readonly cwd: string;
}

async function cli(argv: readonly string[], overrides: Partial<RunDeps> = {}): Promise<Session> {
  const cwd = join(root, `t${String(taken++)}`);
  mkdirSync(cwd);
  let out = "";
  let err = "";
  const code = await run({
    argv,
    cwd,
    out: (text) => {
      out += text;
    },
    err: (text) => {
      err += text;
    },
    ...overrides,
  });
  return { code, out, err, cwd };
}

/** Answers every prompt with the same script, in order, so the order is asserted too. */
function answering(script: readonly string[]): { ask: NonNullable<RunDeps["ask"]>; asked: string[] } {
  const asked: string[] = [];
  let index = 0;
  return {
    asked,
    ask: async (question, fallback) => {
      asked.push(question);
      const answer = script[index++];
      return answer === undefined || answer === "" ? fallback : answer;
    },
  };
}

test("--help prints the usage and succeeds", async () => {
  const session = await cli(["--help"]);

  expect(session.code).toBe(0);
  expect(session.out).toContain("npm create @timedomain/acestudio-workflow-extension");
  expect(session.err).toBe("");
});

test("--version prints the version it was handed", async () => {
  const session = await cli(["--version"], { version: "1.2.3" });

  expect(session.code).toBe(0);
  expect(session.out).toBe("1.2.3\n");
});

test("scaffolds non-interactively from flags alone", async () => {
  const session = await cli(["stems", "--id", "acme.stems", "--name", "Stems", "--publisher", "Acme"]);

  expect(session.code).toBe(0);
  const manifest = readFileSync(join(session.cwd, "stems", "src", "manifest.ts"), "utf8");
  expect(manifest).toContain('id: "acme.stems"');
  expect(existsSync(join(session.cwd, "stems", "AGENTS.md"))).toBe(true);
});

test("points at AGENTS.md once it is done", async () => {
  const session = await cli(["stems", "-y"]);

  expect(session.out).toContain("cd stems");
  expect(session.out).toContain("AGENTS.md");
});

// The next step is meant to be pasted, and a directory name is whatever the author typed
// at the prompt — so a name a shell would split has to come back quoted.
test("quotes the suggested cd when the directory name would not survive a shell", async () => {
  const session = await cli(["stem tools", "-y"]);

  expect(session.out).toContain("cd 'stem tools'");
});

test("derives everything from the directory when there is nobody to ask", async () => {
  const session = await cli(["stem-tools"]);

  expect(session.code).toBe(0);
  const manifest = readFileSync(join(session.cwd, "stem-tools", "src", "manifest.ts"), "utf8");
  expect(manifest).toContain('id: "example-developer.stem-tools"');
  expect(manifest).toContain('name: "Stem Tools"');
});

test("asks for what was not given, in the order the answers build on each other", async () => {
  const { ask, asked } = answering(["stems", "Acme Audio", "Stem Tools", "", "Splits stems."]);

  const session = await cli([], { ask });

  expect(session.code).toBe(0);
  expect(asked).toEqual(["Directory", "Publisher", "Display name", "Extension id", "Description"]);
  const manifest = readFileSync(join(session.cwd, "stems", "src", "manifest.ts"), "utf8");
  // The blank answer took the offered default, which followed the publisher above it.
  expect(manifest).toContain('id: "acme-audio.stems"');
  expect(manifest).toContain('description: "Splits stems."');
});

test("-y takes the defaults even with a terminal there to ask in", async () => {
  const { ask, asked } = answering(["never asked"]);

  const session = await cli(["stems", "-y"], { ask });

  expect(session.code).toBe(0);
  expect(asked).toEqual([]);
});

test("after -- a dashed token is the directory, not an option", async () => {
  const session = await cli(["--", "-stems"]);

  expect(session.code).toBe(0);
  expect(existsSync(join(session.cwd, "-stems", "AGENTS.md"))).toBe(true);
});

test("a flag the parser does not know is a usage error, not a directory", async () => {
  const session = await cli(["--colour=blue"]);

  expect(session.code).toBe(2);
  expect(session.err).toContain("unknown option: --colour");
});

test("a second directory is a usage error rather than a silently dropped argument", async () => {
  const session = await cli(["one", "two"]);

  expect(session.code).toBe(2);
  expect(session.err).toContain("one directory");
});

test("an option missing its value is a usage error", async () => {
  const session = await cli(["stems", "--id"]);

  expect(session.code).toBe(2);
  expect(session.err).toContain("--id needs a value");
});

test("reports a refused scaffold as a failure, not a crash", async () => {
  const session = await cli(["stems", "--id", "Not.AnId"]);

  expect(session.code).toBe(1);
  expect(session.err).toContain("is not an extension id");
});
