import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { run } from "../src/app";
import { ExitCode } from "../src/exit-codes";

/**
 * The real end-to-end driver (AC 4): CLI → live signing service → signed
 * bundle → reference verifier. Skipped unless `ACEWORKFLOW_E2E=1`, because it
 * needs network and a reachable service. Point it at an environment with
 * `ACEWORKFLOW_E2E_SERVICE` (defaults to the dev backend the operator sets)
 * and, to exercise self-verify, `ACEWORKFLOW_E2E_ROOTS` (a roots file for that
 * environment's root). Credentials come from `ACEWORKFLOW_TOKEN`, or pass
 * `--ad-hoc` by setting `ACEWORKFLOW_E2E_ADHOC=1`.
 */
const ENABLED = process.env.ACEWORKFLOW_E2E === "1";

describe.skipIf(!ENABLED)("sign against a live service", () => {
  it("signs a freshly packed extension and the result verifies", async () => {
    const service = process.env.ACEWORKFLOW_E2E_SERVICE;
    expect(service, "set ACEWORKFLOW_E2E_SERVICE").toBeDefined();

    const dir = await mkdtemp(join(tmpdir(), "aceworkflow-e2e-"));
    try {
      const ext = join(dir, "ext");
      await mkdir(join(ext, "dist"), { recursive: true });
      const developerId = process.env.ACEWORKFLOW_E2E_DEVELOPER_ID ?? "team";
      await writeFile(
        join(ext, "manifest.json"),
        JSON.stringify({ id: `${developerId}.e2e-demo`, version: "0.0.1", displayName: "E2E Demo" }),
      );
      await writeFile(join(ext, "dist", "index.js"), "export const answer = 42;\n");

      const outPath = join(dir, "out.aceworkflow");
      const argv = ["sign", ext, "--service", service!, "-o", outPath, "-y"];
      if (process.env.ACEWORKFLOW_E2E_ADHOC === "1") argv.push("--ad-hoc");
      if (process.env.ACEWORKFLOW_E2E_ROOTS !== undefined) argv.push("--roots", process.env.ACEWORKFLOW_E2E_ROOTS);
      else argv.push("--no-verify");

      const code = await run({
        argv,
        env: process.env,
        cwd: dir,
        out: (t) => process.stdout.write(t),
        err: (t) => process.stderr.write(t),
        stdinIsTTY: false,
        stdoutIsTTY: false,
      });
      expect(code).toBe(ExitCode.Success);
      expect(existsSync(outPath)).toBe(true);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});
