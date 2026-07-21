import { afterEach, describe, expect, it, vi } from "vitest";
import { mintAdhocIdentity, submitBundle } from "../src/submit/client";

const SERVICE = new URL("https://workflowext-signing.timedomain.dev/");

afterEach(() => {
  vi.restoreAllMocks();
});

function mockFetch(impl: (url: string, init: RequestInit | undefined) => Response | Promise<Response>): void {
  vi.stubGlobal("fetch", vi.fn((url: string | URL, init?: RequestInit) => Promise.resolve(impl(String(url), init))));
}

describe("submitBundle", () => {
  it("sends the bearer + body and parses the signed response", async () => {
    const signed = new Uint8Array([1, 2, 3]);
    let seenAuth: string | null = null;
    let seenUrl = "";
    mockFetch((url, init) => {
      seenUrl = url;
      seenAuth = new Headers(init?.headers).get("authorization");
      return new Response(signed, {
        status: 200,
        headers: {
          "content-type": "application/zip",
          "content-disposition": 'attachment; filename="demo-1.2.0.aceworkflow"',
          "x-extension-id": "team.demo",
          "x-developer-id": "team",
          "x-version": "1.2.0",
          "x-signed-at": "1752710400",
          "x-bundle-sha256": "abc123",
        },
      });
    });

    const result = await submitBundle(SERVICE, "wxsa_deadbeef", new Uint8Array([9]));
    expect(seenUrl).toBe("https://workflowext-signing.timedomain.dev/submissions");
    expect(seenAuth).toBe("Bearer wxsa_deadbeef");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(Array.from(result.value.signedBundle)).toEqual([1, 2, 3]);
    expect(result.value).toMatchObject({
      extensionId: "team.demo",
      developerId: "team",
      version: "1.2.0",
      signedAt: 1752710400,
      bundleSha256: "abc123",
      filename: "demo-1.2.0.aceworkflow",
    });
  });

  it("surfaces the service error code on refusal", async () => {
    mockFetch(() => new Response(JSON.stringify({ error: "too many requests", code: "rate-limited" }), { status: 429 }));
    const result = await submitBundle(SERVICE, "wxsa_x", new Uint8Array([1]));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toMatchObject({ status: 429, code: "rate-limited" });
  });

  it("maps a transport failure to a network-error code", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.reject(new Error("ECONNREFUSED"))));
    const result = await submitBundle(SERVICE, "wxsa_x", new Uint8Array([1]));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("network-error");
    expect(result.error.status).toBe(0);
  });

  it("treats a non-JSON error body as a generic http-error", async () => {
    mockFetch(() => new Response("<html>502</html>", { status: 502 }));
    const result = await submitBundle(SERVICE, "wxsa_x", new Uint8Array([1]));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("http-error");
    expect(result.error.status).toBe(502);
  });
});

describe("mintAdhocIdentity", () => {
  it("returns the minted identity on 201", async () => {
    mockFetch((url) => {
      expect(url).toBe("https://workflowext-signing.timedomain.dev/ad-hoc/identities");
      return new Response(JSON.stringify({ developerId: "adhoc-abc123def456", secret: "wxsa_feedface" }), {
        status: 201,
      });
    });
    const result = await mintAdhocIdentity(SERVICE);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value).toEqual({ developerId: "adhoc-abc123def456", secret: "wxsa_feedface" });
  });

  it("flags a malformed mint body", async () => {
    mockFetch(() => new Response(JSON.stringify({ nope: true }), { status: 201 }));
    const result = await mintAdhocIdentity(SERVICE);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("malformed-response");
  });
});
