import { mkdir, mkdtemp, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, sep } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { scaffold, ScaffoldError } from "@timedomain/create-acestudio-workflow-extension";
import { run, type RunDeps } from "../src/app";
import { ExitCode } from "../src/exit-codes";
import type { Prompter } from "../src/prompt";

// ADR 0113 §7's first constraint, as a tripwire: `init` calls the initializer
// in-process, so nothing on this path may spawn anything. A subprocess would go back
// to the registry and re-resolve `@latest`, scaffolding from templates of a different
// version than the CLI that was asked. Nothing imports child_process today, which is
// the state this mock exists to keep.
vi.mock("node:child_process", () => {
  const refuse = (): never => {
    throw new Error("aceworkflow init must not spawn a subprocess");
  };
  const module = {
    spawn: refuse,
    spawnSync: refuse,
    exec: refuse,
    execSync: refuse,
    execFile: refuse,
    execFileSync: refuse,
    fork: refuse,
  };
  return { ...module, default: module };
});

/** The identity a test supplies outright, so nothing has to be asked for or derived. */
const IDENTITY = [
  "--id",
  "acme.stem-tools",
  "--name",
  "Stem Tools",
  "--publisher",
  "Acme Audio",
  "--description",
  "Split stems without leaving the timeline",
] as const;

let dir: string;
let out: string[];
let err: string[];
let fetched: ReturnType<typeof vi.fn>;

/** A prompter that fails the test rather than answering — for every non-interactive case. */
const refusingPrompter: Prompter = {
  line() {
    throw new Error("init prompted with no terminal to prompt in");
  },
  choice() {
    throw new Error("init prompted with no terminal to prompt in");
  },
};

function deps(argv: string[], overrides: Partial<RunDeps> = {}): RunDeps {
  return {
    argv,
    env: {},
    cwd: dir,
    out: (t) => out.push(t),
    err: (t) => err.push(t),
    stdinIsTTY: false,
    stdoutIsTTY: false,
    prompter: refusingPrompter,
    ...overrides,
  };
}

/** Every file under `root`, as directory-relative POSIX path → contents. */
async function treeOf(root: string): Promise<Record<string, string>> {
  const entries = await readdir(root, { recursive: true, withFileTypes: true });
  const tree: Record<string, string> = {};
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    const full = join(entry.parentPath, entry.name);
    tree[full.slice(root.length + 1).split(sep).join("/")] = await readFile(full, "utf8");
  }
  return tree;
}

/** Scaffolds the reference tree by calling the initializer directly. */
async function reference(directory: string, overrides: Record<string, string> = {}): Promise<string> {
  await scaffold({
    directory,
    id: "acme.stem-tools",
    name: "Stem Tools",
    publisher: "Acme Audio",
    description: "Split stems without leaving the timeline",
    ...overrides,
  });
  return directory;
}

beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), "aceworkflow-init-"));
  out = [];
  err = [];
  // The verb works with the registry unreachable: any HTTP at all is a failure.
  fetched = vi.fn(() => {
    throw new Error("aceworkflow init must not reach the network");
  });
  vi.stubGlobal("fetch", fetched);
});

afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("init emits what the initializer emits", () => {
  it("writes the same tree, byte for byte, as a direct scaffold() of the same inputs", async () => {
    // Same basename in both trees: the scaffold's package name comes from the
    // directory's basename, so comparing across differing names would compare noise.
    const door = join(dir, "door");
    await mkdir(door, { recursive: true });

    expect(await run(deps(["init", "stem-tools", ...IDENTITY], { cwd: door }))).toBe(ExitCode.Success);

    const expected = await reference(join(dir, "reference", "stem-tools"));
    expect(await treeOf(join(door, "stem-tools"))).toEqual(await treeOf(expected));
  });

  it("reports the emitted directory and the file list under --json", async () => {
    expect(await run(deps(["init", "stem-tools", ...IDENTITY, "--json"]))).toBe(ExitCode.Success);

    const result = JSON.parse(out.join("")) as { command: string; directory: string; files: string[] };
    expect(result.command).toBe("init");
    expect(result.directory).toBe(join(dir, "stem-tools"));
    expect(result.files).toEqual(Object.keys(await treeOf(join(dir, "stem-tools"))).sort());
  });

  it("touches no network on the way", async () => {
    expect(await run(deps(["init", "stem-tools", ...IDENTITY]))).toBe(ExitCode.Success);
    expect(fetched).not.toHaveBeenCalled();
  });
});

describe("init refuses what the initializer refuses", () => {
  it("gives a non-empty directory the initializer's own message", async () => {
    const occupied = join(dir, "occupied");
    await mkdir(occupied, { recursive: true });
    await writeFile(join(occupied, "notes.md"), "work in progress\n");

    const code = await run(deps(["init", "occupied", ...IDENTITY]));
    expect(code).toBe(ExitCode.Generic);
    expect(err.join("")).toContain(await refusalOf(occupied));
    // Refused before writing: the directory still holds only what was there.
    expect(Object.keys(await treeOf(occupied))).toEqual(["notes.md"]);
  });

  it("gives a malformed id the initializer's own message", async () => {
    const code = await run(deps(["init", "stem-tools", "--id", "com.acme.stem-tools"]));
    expect(code).toBe(ExitCode.Generic);
    expect(err.join("")).toContain("is not an extension id");
  });

  /** The message the initializer itself produces for this directory. */
  async function refusalOf(directory: string): Promise<string> {
    try {
      await reference(directory);
    } catch (error) {
      if (error instanceof ScaffoldError) return error.message;
      throw error;
    }
    throw new Error("scaffold() accepted a directory it should have refused");
  }
});

describe("init's non-interactive contract", () => {
  it("never prompts when there is no terminal, deriving what it was not told", async () => {
    expect(await run(deps(["init", "stem-tools"]))).toBe(ExitCode.Success);

    const manifest = await readFile(join(dir, "stem-tools", "src", "manifest.ts"), "utf8");
    expect(manifest).toContain("example-developer.stem-tools");
    expect(manifest).toContain("Example Developer");
  });

  it("never prompts under -y even on a terminal", async () => {
    const code = await run(
      deps(["init", "stem-tools", "-y"], { stdinIsTTY: true, stdoutIsTTY: true }),
    );
    expect(code).toBe(ExitCode.Success);
  });

  it("never prompts in CI even on a terminal", async () => {
    const code = await run(
      deps(["init", "stem-tools"], { stdinIsTTY: true, stdoutIsTTY: true, env: { CI: "1" } }),
    );
    expect(code).toBe(ExitCode.Success);
  });

  it("takes the initializer's own default directory, rather than hanging or refusing", async () => {
    expect(await run(deps(["init"]))).toBe(ExitCode.Success);
    expect(Object.keys(await treeOf(join(dir, "my-extension")))).toContain("AGENTS.md");
  });

  it("refuses a second directory instead of quietly dropping it", async () => {
    const code = await run(deps(["init", "stem-tools", "extra", "--json"]));
    expect(code).toBe(ExitCode.Usage);
    expect(JSON.parse(out.join("")) as { code: string }).toMatchObject({ code: "usage" });
  });
});

describe("init on a terminal", () => {
  it("asks for what it was not told, and derives the id from the publisher just answered", async () => {
    const asked: string[] = [];
    const answers: Record<string, string> = { Directory: "stem-tools", Publisher: "Acme Audio" };
    const prompter: Prompter = {
      async line(question: string): Promise<string> {
        asked.push(question);
        // Everything else is left blank, which takes the offered default — the
        // point being that the default offered for the id follows the publisher.
        return answers[question.split(" (")[0] as string] ?? "";
      },
      async choice(): Promise<string> {
        throw new Error("init asked a multiple-choice question");
      },
    };

    const code = await run(deps(["init"], { stdinIsTTY: true, stdoutIsTTY: true, prompter }));
    expect(code).toBe(ExitCode.Success);
    expect(asked.map((question) => question.split(" (")[0])).toEqual([
      "Directory",
      "Publisher",
      "Display name",
      "Extension id",
      "Description",
    ]);

    const manifest = await readFile(join(dir, "stem-tools", "src", "manifest.ts"), "utf8");
    expect(manifest).toContain("acme-audio.stem-tools");
    expect(manifest).toContain("Stem Tools");
    expect(manifest).toContain("Acme Audio");
  });
});

describe("init is discoverable", () => {
  it("is listed beside the spine in the binary's help", async () => {
    expect(await run(deps(["--help"]))).toBe(ExitCode.Success);
    expect(out.join("")).toContain("aceworkflow init");
  });

  it("documents its own options, and names the other door", async () => {
    expect(await run(deps(["init", "--help"]))).toBe(ExitCode.Success);
    const help = out.join("");
    for (const option of ["--id", "--name", "--publisher", "--description", "-y"]) {
      expect(help).toContain(option);
    }
    expect(help).toContain("npm create @timedomain/acestudio-workflow-extension");
  });

  it("falls back to the summary for a topic that is only a prototype method", async () => {
    expect(await run(deps(["help", "toString"]))).toBe(ExitCode.Success);
    expect(out.join("")).toContain("the ACE Studio workflow-extension toolchain");
  });

  it("reaches the same text through `help init`", async () => {
    expect(await run(deps(["help", "init"]))).toBe(ExitCode.Success);
    const viaHelp = out.join("");
    out = [];
    await run(deps(["init", "--help"]));
    expect(viaHelp).toBe(out.join(""));
  });
});

describe("the dependency points one way", () => {
  it("has the CLI declare the initializer, and the initializer declare nothing", async () => {
    const manifest = async (path: string): Promise<Record<string, Record<string, string> | undefined>> =>
      JSON.parse(await readFile(new URL(path, import.meta.url), "utf8")) as Record<
        string,
        Record<string, string> | undefined
      >;

    const cli = await manifest("../package.json");
    expect(cli.dependencies?.["@timedomain/create-acestudio-workflow-extension"]).toBeDefined();

    // The zero-dependency property of the `npm create` path: nothing may point back,
    // or the native keychain binding lands on it (ADR 0113 §7).
    const initializer = await manifest("../../create-acestudio-workflow-extension/package.json");
    for (const field of ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"]) {
      expect(Object.keys(initializer[field] ?? {})).toEqual([]);
    }
  });
});
