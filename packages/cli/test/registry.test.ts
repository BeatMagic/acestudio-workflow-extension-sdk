import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { lookupDeveloper, registryCachePath } from "../src/trust/registry";
import { makeTestSigner, rootsOf, signedTrustRegistry } from "./fixtures";

const SERVICE = new URL("https://svc.example");
let dir: string;

beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), "aceworkflow-registry-"));
});
afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
});

/** A fetcher that serves one registry and counts how often it is asked. */
function server(bytes: Uint8Array): { fetchBytes: () => Promise<Uint8Array>; calls: () => number } {
  let calls = 0;
  return {
    fetchBytes: async () => {
      calls += 1;
      return bytes;
    },
    calls: () => calls,
  };
}

describe("lookupDeveloper", () => {
  it("reports a registered identity with its tier", async () => {
    const signer = await makeTestSigner();
    const net = server(await signedTrustRegistry(signer, { partnerco: "verified-partner" }));
    const standing = await lookupDeveloper(SERVICE, "partnerco", {
      roots: rootsOf(signer),
      dir,
      fetchBytes: net.fetchBytes,
    });
    expect(standing).toMatchObject({ known: true, registered: true, tier: "verified-partner" });
  });

  it("answers a cached hit without asking the service again", async () => {
    const signer = await makeTestSigner();
    const net = server(await signedTrustRegistry(signer, { partnerco: "verified-partner" }));
    const deps = { roots: rootsOf(signer), dir, fetchBytes: net.fetchBytes };
    await lookupDeveloper(SERVICE, "partnerco", deps);
    await lookupDeveloper(SERVICE, "partnerco", deps);
    expect(net.calls()).toBe(1);
  });

  it("refreshes when asked about an id the cache has never seen", async () => {
    // The point of the whole cache: identities are granted in the web portal,
    // so a slug missing locally is indistinguishable from one granted since the
    // cache was written. A miss re-reads instead of concluding.
    const signer = await makeTestSigner();
    const stale = server(await signedTrustRegistry(signer, { partnerco: "verified-partner" }, 1));
    const deps = { roots: rootsOf(signer), dir, fetchBytes: stale.fetchBytes };
    expect(await lookupDeveloper(SERVICE, "partnerco", deps)).toMatchObject({ registered: true });

    const grown = server(await signedTrustRegistry(signer, { partnerco: "verified-partner", newco: "official" }, 2));
    const standing = await lookupDeveloper(SERVICE, "newco", {
      roots: rootsOf(signer),
      dir,
      fetchBytes: grown.fetchBytes,
    });
    expect(grown.calls()).toBe(1);
    expect(standing).toMatchObject({ known: true, registered: true, tier: "official" });
  });

  it("refuses a registry older than one it has already accepted", async () => {
    // The sequence ratchet is the client's to keep (ADR 0089 §3-4): answering
    // from a rolled-back file would undo a grant this machine has seen.
    const signer = await makeTestSigner();
    const current = server(await signedTrustRegistry(signer, { partnerco: "verified-partner" }, 9));
    const deps = { roots: rootsOf(signer), dir, fetchBytes: current.fetchBytes };
    await lookupDeveloper(SERVICE, "partnerco", deps);

    const rolledBack = server(await signedTrustRegistry(signer, {}, 2));
    const standing = await lookupDeveloper(SERVICE, "partnerco", {
      roots: rootsOf(signer),
      dir,
      fetchBytes: rolledBack.fetchBytes,
    });
    expect(standing).toMatchObject({ known: true, registered: true, tier: "verified-partner" });
  });

  it("drops a cached record whose sequence is not a number, rather than ratcheting on it", async () => {
    // A sequence that is not a number makes `payload.sequence < cached.sequence`
    // answer false whatever arrives, which would wave a rolled-back registry
    // through the one check that exists to stop it. Such a record is discarded
    // on read, so the fetched file is judged on its own.
    const signer = await makeTestSigner();
    await writeFile(
      registryCachePath(dir),
      JSON.stringify({
        version: 1,
        services: { [SERVICE.origin]: { sequence: "9999", entries: { partnerco: { displayName: "P", tier: "official" } } } },
      }),
    );

    const fresh = server(await signedTrustRegistry(signer, { partnerco: "verified-partner" }, 3));
    const standing = await lookupDeveloper(SERVICE, "partnerco", {
      roots: rootsOf(signer),
      dir,
      fetchBytes: fresh.fetchBytes,
    });
    expect(standing).toMatchObject({ known: true, registered: true, tier: "verified-partner" });
  });

  it("survives a cached record with no entries at all", async () => {
    const signer = await makeTestSigner();
    await writeFile(
      registryCachePath(dir),
      JSON.stringify({ version: 1, services: { [SERVICE.origin]: { sequence: 4 } } }),
    );

    const fresh = server(await signedTrustRegistry(signer, { partnerco: "official" }, 5));
    const standing = await lookupDeveloper(SERVICE, "partnerco", {
      roots: rootsOf(signer),
      dir,
      fetchBytes: fresh.fetchBytes,
    });
    expect(standing).toMatchObject({ known: true, registered: true, tier: "official" });
  });

  it("says it does not know when the registry cannot be reached", async () => {
    const signer = await makeTestSigner();
    const standing = await lookupDeveloper(SERVICE, "anyone", {
      roots: rootsOf(signer),
      dir,
      fetchBytes: () => Promise.reject(new Error("offline")),
    });
    expect(standing).toEqual({ known: false });
  });

  it("says it does not know when the registry does not verify", async () => {
    // Signed by a root this client does not trust: advisory checks must fail
    // open, since the service re-checks everything that matters.
    const signer = await makeTestSigner();
    const net = server(await signedTrustRegistry(signer, { partnerco: "official" }));
    const standing = await lookupDeveloper(SERVICE, "partnerco", {
      roots: [{ keyId: "root-1", publicKey: new Uint8Array(32) }],
      dir,
      fetchBytes: net.fetchBytes,
    });
    expect(standing).toEqual({ known: false });
  });

  it("reports an id absent from a verified registry as simply not registered", async () => {
    const signer = await makeTestSigner();
    const net = server(await signedTrustRegistry(signer, { partnerco: "official" }));
    const standing = await lookupDeveloper(SERVICE, "acme", {
      roots: rootsOf(signer),
      dir,
      fetchBytes: net.fetchBytes,
    });
    expect(standing).toEqual({ known: true, registered: false });
  });
});
