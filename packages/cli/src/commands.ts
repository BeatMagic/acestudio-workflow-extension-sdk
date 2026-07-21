import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { PACK_MODIFIED_AT } from "./bundle/constants";
import { deriveBundleName, extensionSlug, packDir, PackError } from "./bundle/pack";
import { writeZip } from "./bundle/zip";
import type { Ctx } from "./context";
import { classifyCredential } from "./credentials/classify";
import { resolveCredential } from "./credentials/resolve";
import { ExitCode, exitForServiceCode } from "./exit-codes";
import { mintAdhocIdentity, submitBundle, type SignedResult } from "./submit/client";
import type { TrustedRoot } from "@timedomain/workflowext-verifier";
import { defaultRoots, loadRoots, RootsError } from "./verify/roots";
import { verifyBundleBytes } from "./verify/verify";

const SIGN_OUTPUT_DIR = "dist";

function requirePositional(ctx: Ctx, name: string): string | null {
  const value = ctx.positionals[0];
  if (value === undefined || value.length === 0) {
    ctx.reporter.failure(`missing required argument: ${name}`, "usage");
    return null;
  }
  return value;
}

/** Resolves a user-supplied path against the injected cwd; absolute paths pass through. */
function atCwd(ctx: Ctx, p: string): string {
  return resolve(ctx.cwd, p);
}

/** The trust anchor: an explicit --roots file (resolved against cwd) or the embedded default. */
async function resolveRoots(ctx: Ctx): Promise<TrustedRoot[]> {
  return ctx.options.roots !== undefined ? loadRoots(atCwd(ctx, ctx.options.roots)) : defaultRoots();
}

function signedFilename(result: SignedResult): string {
  if (result.filename !== null && result.filename.length > 0) return result.filename;
  if (result.extensionId.length > 0 && result.version.length > 0) {
    return `${extensionSlug(result.extensionId)}-${result.version}.aceworkflow`;
  }
  return "signed.aceworkflow";
}

function maskBearer(bearer: string): string {
  return bearer.length > 12 ? `${bearer.slice(0, 5)}…${bearer.slice(-4)}` : "…";
}

async function writeOutput(path: string, bytes: Uint8Array): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, bytes);
}

type Acquired = { ok: true; bearer: string } | { ok: false; exit: ExitCode };

/**
 * Resolves the bearer for the target service, or — with `--ad-hoc` — mints and
 * caches a fresh anonymous one. Emits the failure itself and hands back the
 * exit code, so callers just `return acquired.exit`.
 */
async function acquireBearer(ctx: Ctx): Promise<Acquired> {
  const resolved = await resolveCredential({
    explicitToken: ctx.options.token,
    env: ctx.env,
    store: ctx.store,
    origin: ctx.service.url.origin,
  });
  if (resolved !== null) return { ok: true, bearer: resolved.bearer };

  if (ctx.options.adHoc) {
    const mint = await mintAdhocIdentity(ctx.service.url);
    if (!mint.ok) {
      ctx.reporter.failure(mint.error.message, mint.error.code);
      return { ok: false, exit: exitForServiceCode(mint.error.code) };
    }
    await ctx.store.set(ctx.service.url.origin, mint.value.secret);
    ctx.reporter.step(`✓ minted ad-hoc identity  ${mint.value.developerId}`);
    return { ok: true, bearer: mint.value.secret };
  }

  // The prompt tail of the resolution order. Only a real interactive TTY
  // reaches here; a token is offered (not a silent ad-hoc mint — that stays
  // behind the explicit --ad-hoc), and a pasted token is stored for continuity.
  if (ctx.interactive) {
    const token = await ctx.prompter.line(
      `No credential for ${ctx.service.url.origin}. Paste an API token (or leave blank to cancel): `,
    );
    if (token.length > 0) {
      await ctx.store.set(ctx.service.url.origin, token);
      return { ok: true, bearer: token };
    }
  }

  ctx.reporter.failure(
    "no credential for this service; run `aceworkflow login`, pass --token, or pass --ad-hoc",
    "missing-credential",
  );
  return { ok: false, exit: ExitCode.MissingCredential };
}

export async function cmdPack(ctx: Ctx): Promise<number> {
  const dir = requirePositional(ctx, "<dir>");
  if (dir === null) return ExitCode.Usage;

  let files;
  try {
    files = await packDir(atCwd(ctx, dir));
  } catch (error) {
    if (error instanceof PackError) {
      ctx.reporter.failure(error.message, "pack-failed");
      return ExitCode.Generic;
    }
    throw error;
  }

  const name = deriveBundleName(files);
  const outPath =
    ctx.options.out !== undefined ? atCwd(ctx, ctx.options.out) : name !== null ? join(ctx.cwd, name) : null;
  if (outPath === null) {
    ctx.reporter.failure("cannot derive an output name from the manifest; pass -o <file>", "usage");
    return ExitCode.Usage;
  }

  const bytes = await writeZip(files, PACK_MODIFIED_AT);
  await writeOutput(outPath, bytes);
  ctx.reporter.result(`packed ${dir} → ${outPath} (${files.length} entries)`, {
    command: "pack",
    output: outPath,
    entries: files.length,
  });
  return ExitCode.Success;
}

export async function cmdVerify(ctx: Ctx): Promise<number> {
  const bundle = requirePositional(ctx, "<bundle.aceworkflow>");
  if (bundle === null) return ExitCode.Usage;

  let roots;
  try {
    roots = await resolveRoots(ctx);
  } catch (error) {
    if (error instanceof RootsError) {
      ctx.reporter.failure(error.message, "no-trusted-roots");
      return ExitCode.Generic;
    }
    throw error;
  }

  let bytes: Uint8Array;
  try {
    bytes = new Uint8Array(await readFile(atCwd(ctx, bundle)));
  } catch {
    ctx.reporter.failure(`cannot read ${bundle}`, "io-error");
    return ExitCode.Generic;
  }

  const result = await verifyBundleBytes(bytes, roots);
  if (!result.ok && "malformed" in result) {
    ctx.reporter.failure(`not a valid bundle: ${result.malformed}`, "malformed-archive");
    return ExitCode.VerifyFailed;
  }
  if (!result.ok) {
    const detail = result.verdict.detail !== undefined ? ` (${result.verdict.detail})` : "";
    ctx.reporter.failure(`verify rejected: ${result.verdict.reason}${detail}`, "verify-rejected");
    return ExitCode.VerifyFailed;
  }
  const { payload } = result.verdict;
  ctx.reporter.result(`verified ${bundle}: ACCEPT (${payload.extensionId} ${payload.version})`, {
    command: "verify",
    ok: true,
    extensionId: payload.extensionId,
    developerId: payload.developerId,
    version: payload.version,
    signedAt: payload.signedAt,
  });
  return ExitCode.Success;
}

export async function cmdSubmit(ctx: Ctx): Promise<number> {
  const bundle = requirePositional(ctx, "<bundle.aceworkflow>");
  if (bundle === null) return ExitCode.Usage;

  let bytes: Uint8Array<ArrayBuffer>;
  try {
    bytes = new Uint8Array(await readFile(atCwd(ctx, bundle)));
  } catch {
    ctx.reporter.failure(`cannot read ${bundle}`, "io-error");
    return ExitCode.Generic;
  }

  const acquired = await acquireBearer(ctx);
  if (!acquired.ok) return acquired.exit;

  const res = await submitBundle(ctx.service.url, acquired.bearer, bytes);
  if (!res.ok) {
    ctx.reporter.failure(res.error.message, res.error.code);
    return exitForServiceCode(res.error.code);
  }

  const outPath =
    ctx.options.out !== undefined ? atCwd(ctx, ctx.options.out) : join(ctx.cwd, signedFilename(res.value));
  await writeOutput(outPath, res.value.signedBundle);
  ctx.reporter.result(`signed ${res.value.extensionId} ${res.value.version} → ${outPath}`, {
    command: "submit",
    output: outPath,
    extensionId: res.value.extensionId,
    developerId: res.value.developerId,
    version: res.value.version,
    signedAt: res.value.signedAt,
    bundleSha256: res.value.bundleSha256,
  });
  return ExitCode.Success;
}

export async function cmdSign(ctx: Ctx): Promise<number> {
  const input = requirePositional(ctx, "<dir|bundle>");
  if (input === null) return ExitCode.Usage;
  const inputPath = atCwd(ctx, input);

  let unsigned: Uint8Array<ArrayBuffer>;
  let isDirectory: boolean;
  try {
    isDirectory = (await stat(inputPath)).isDirectory();
  } catch {
    ctx.reporter.failure(`cannot read ${input}`, "io-error");
    return ExitCode.Generic;
  }

  if (isDirectory) {
    let files;
    try {
      files = await packDir(inputPath);
    } catch (error) {
      if (error instanceof PackError) {
        ctx.reporter.failure(error.message, "pack-failed");
        return ExitCode.Generic;
      }
      throw error;
    }
    unsigned = await writeZip(files, PACK_MODIFIED_AT);
    ctx.reporter.step(`✓ packed        ${input} (${files.length} entries)`);
  } else {
    try {
      unsigned = new Uint8Array(await readFile(inputPath));
    } catch {
      ctx.reporter.failure(`cannot read ${input}`, "io-error");
      return ExitCode.Generic;
    }
  }

  const acquired = await acquireBearer(ctx);
  if (!acquired.ok) return acquired.exit;

  const res = await submitBundle(ctx.service.url, acquired.bearer, unsigned);
  if (!res.ok) {
    ctx.reporter.failure(res.error.message, res.error.code);
    return exitForServiceCode(res.error.code);
  }
  const value = res.value;
  ctx.reporter.step(`✓ submitted     POST /submissions`);
  ctx.reporter.step(
    `✓ signed        extension-id=${value.extensionId} version=${value.version} sha256=${value.bundleSha256}`,
  );

  let verified: boolean | null = null;
  if (!ctx.options.noVerify) {
    let roots;
    try {
      roots = await resolveRoots(ctx);
    } catch (error) {
      if (!(error instanceof RootsError)) throw error;
      // No trust anchor to check against — announce loudly and continue rather
      // than block signing. This is a config gap (no root embedded yet), not a
      // bad bundle; --no-verify silences it deliberately.
      ctx.reporter.step(`! self-verify skipped: ${error.message}`);
      roots = null;
    }
    if (roots !== null) {
      const check = await verifyBundleBytes(value.signedBundle, roots);
      if (!check.ok) {
        const reason = "malformed" in check ? check.malformed : check.verdict.reason;
        ctx.reporter.failure(`self-verify failed: ${reason}`, "verify-rejected");
        return ExitCode.VerifyFailed;
      }
      verified = true;
      ctx.reporter.step(`✓ verified      reference-verifier: ACCEPT`);
    }
  }

  const outPath =
    ctx.options.out !== undefined ? atCwd(ctx, ctx.options.out) : join(ctx.cwd, SIGN_OUTPUT_DIR, signedFilename(value));
  await writeOutput(outPath, value.signedBundle);
  ctx.reporter.step(`→ wrote         ${outPath}`);
  ctx.reporter.result(`signed ${value.extensionId} ${value.version} → ${outPath}`, {
    command: "sign",
    output: outPath,
    extensionId: value.extensionId,
    developerId: value.developerId,
    version: value.version,
    signedAt: value.signedAt,
    bundleSha256: value.bundleSha256,
    verified,
  });
  return ExitCode.Success;
}

export async function cmdLogin(ctx: Ctx): Promise<number> {
  const origin = ctx.service.url.origin;

  if (ctx.options.token !== undefined) {
    const token = ctx.options.token.trim();
    if (token.length === 0) {
      ctx.reporter.failure("empty --token", "usage");
      return ExitCode.Usage;
    }
    await ctx.store.set(origin, token);
    return reportLogin(ctx, origin, token, undefined);
  }

  if (ctx.options.adHoc) {
    return loginAdhoc(ctx, origin);
  }

  if (!ctx.interactive) {
    ctx.reporter.failure(
      "login needs --token or --ad-hoc in a non-interactive session",
      "usage",
    );
    return ExitCode.Usage;
  }

  const kind = await ctx.prompter.choice("Sign in as", ["registered", "ad-hoc"]);
  if (kind === "ad-hoc") {
    return loginAdhoc(ctx, origin);
  }
  const token = await ctx.prompter.line("Paste your API token: ");
  if (token.length === 0) {
    ctx.reporter.failure("no token entered", "usage");
    return ExitCode.Usage;
  }
  await ctx.store.set(origin, token);
  return reportLogin(ctx, origin, token, undefined);
}

async function loginAdhoc(ctx: Ctx, origin: string): Promise<number> {
  const mint = await mintAdhocIdentity(ctx.service.url);
  if (!mint.ok) {
    ctx.reporter.failure(mint.error.message, mint.error.code);
    return exitForServiceCode(mint.error.code);
  }
  await ctx.store.set(origin, mint.value.secret);
  return reportLogin(ctx, origin, mint.value.secret, mint.value.developerId);
}

function reportLogin(ctx: Ctx, origin: string, bearer: string, developerId: string | undefined): number {
  const kind = classifyCredential(bearer);
  const human =
    developerId !== undefined
      ? `logged in to ${origin} as ad-hoc identity ${developerId}`
      : `logged in to ${origin} (${kind} credential)`;
  ctx.reporter.result(human, { command: "login", origin, kind, ...(developerId !== undefined ? { developerId } : {}) });
  return ExitCode.Success;
}

export async function cmdLogout(ctx: Ctx): Promise<number> {
  const origin = ctx.service.url.origin;
  const removed = await ctx.store.remove(origin);
  ctx.reporter.result(removed ? `logged out of ${origin}` : `no stored credential for ${origin}`, {
    command: "logout",
    origin,
    removed,
  });
  return ExitCode.Success;
}

export async function cmdWhoami(ctx: Ctx): Promise<number> {
  const origin = ctx.service.url.origin;
  const resolved = await resolveCredential({
    explicitToken: ctx.options.token,
    env: ctx.env,
    store: ctx.store,
    origin,
  });
  if (resolved === null) {
    ctx.reporter.failure(`no credential for ${origin}`, "missing-credential");
    return ExitCode.MissingCredential;
  }
  const kind = classifyCredential(resolved.bearer);
  const label =
    kind === "unknown" ? "credential present (kind resolved by the service)" : `${kind} credential`;
  ctx.reporter.result(`${label} for ${origin} (from ${resolved.source})`, {
    command: "whoami",
    origin,
    kind,
    source: resolved.source,
    credential: maskBearer(resolved.bearer),
  });
  return ExitCode.Success;
}
