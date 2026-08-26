import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { writeManifestJson } from "@timedomain/acestudio-workflow-extension-sdk";
import { run } from "../src/app";
import { FileCredentialStore } from "../src/credentials/store";
import { ExitCode } from "../src/exit-codes";

/**
 * The real end-to-end driver (AC 4 of BeatMagic/ACE-Studio#1675): CLI → live signing service →
 * signed bundle → reference verifier. Everything else in this suite mocks the
 * service, so this is the only place the wire is actually exercised — and the
 * only place a client/service disagreement can surface before a developer hits
 * it.
 *
 * Two things it deliberately does not do:
 *
 * - **It does not hand-write the manifest.** The fixture goes through the SDK's
 *   `writeManifestJson`, which is the function every scaffolded extension's
 *   build calls. A hand-written fixture is how the service came to require a
 *   key the shipping toolchain never emitted while every test stayed green.
 * - **It does not skip verification.** The signed result is checked against the
 *   CLI's embedded production root, because every environment shares one root
 *   and differs only in its intermediate. `ACEWORKFLOW_E2E_ROOTS` overrides that
 *   for an environment with a root of its own; there is no path that signs
 *   without checking, since checking *is* the acceptance criterion.
 *
 * Skipped unless `ACEWORKFLOW_E2E=1`. Point it at an environment with
 * `ACEWORKFLOW_E2E_SERVICE`. It signs anonymously by default — an ad-hoc mint
 * needs no credential — under the developer id `ACEWORKFLOW_E2E_DEVELOPER_ID`
 * puts in the manifest; set `ACEWORKFLOW_TOKEN` instead to exercise the
 * registered path.
 */
const ENABLED = process.env.ACEWORKFLOW_E2E === "1";

const DEVELOPER_ID = process.env.ACEWORKFLOW_E2E_DEVELOPER_ID ?? "aceworkflow-e2e";

describe.skipIf(!ENABLED)("sign against a live service", () => {
  it("signs a freshly packed extension, and the reference verifier accepts the result", async () => {
    const service = process.env.ACEWORKFLOW_E2E_SERVICE;
    expect(service, "set ACEWORKFLOW_E2E_SERVICE").toBeDefined();

    const dir = await mkdtemp(join(tmpdir(), "aceworkflow-e2e-"));
    try {
      // The bundle root, built the way `npm run build` builds one: the SDK
      // emits the manifest, so this fixture cannot drift from what a real
      // extension ships.
      const bundleRoot = join(dir, "dist");
      await mkdir(bundleRoot, { recursive: true });
      await writeManifestJson(
        {
          id: `${DEVELOPER_ID}.e2e-demo`,
          name: "E2E Demo",
          version: "0.0.1",
          publisher: "ACE Studio CI",
          description: "Signed by the aceworkflow end-to-end driver.",
          lifecycle: "one-shot",
          capabilities: [],
          entry: "index.js",
        },
        bundleRoot,
      );
      await writeFile(join(bundleRoot, "index.js"), "export const answer = 42;\n");

      const outPath = join(dir, "signed.aceworkflow");
      const argv = ["sign", bundleRoot, "--service", service!, "-o", outPath, "-y"];
      // No token in the environment means the anonymous path, which is the one
      // every developer meets first. The identity comes from the manifest above
      // (ADR 0098 §3), so there is nothing further to pass.
      if (process.env.ACEWORKFLOW_TOKEN === undefined) argv.push("--ad-hoc");
      if (process.env.ACEWORKFLOW_E2E_ROOTS !== undefined) {
        argv.push("--roots", process.env.ACEWORKFLOW_E2E_ROOTS);
      }

      const out: string[] = [];
      const err: string[] = [];
      const code = await run({
        argv,
        env: process.env,
        cwd: dir,
        out: (t) => out.push(t),
        err: (t) => err.push(t),
        // A private store and cache dir, so a CI run never reads or writes the
        // credentials or trust-registry cache this machine happens to have.
        store: new FileCredentialStore(join(dir, "credentials")),
        configDir: join(dir, "config"),
        stdinIsTTY: false,
        stdoutIsTTY: false,
      });

      const transcript = out.concat(err).join("");
      expect(code, transcript).toBe(ExitCode.Success);
      // The verify step is the acceptance criterion, so assert it ran rather
      // than inferring it from the exit code — `--no-verify` also exits 0.
      expect(transcript).toContain("reference-verifier: ACCEPT");
      expect(readFileSync(outPath).byteLength).toBeGreaterThan(0);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});
