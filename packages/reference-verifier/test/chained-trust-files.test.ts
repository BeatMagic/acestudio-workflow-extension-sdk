import { describe, expect, it } from "vitest";
import { Ajv2020 } from "ajv/dist/2020.js";
import {
  createSignedEnvelope,
  utf8Encode,
  type SignedEnvelope,
} from "@timedomain/workflowext-signed-json";
import { revocationListSchema, trustRegistrySchema } from "@timedomain/workflowext-wire-schemas";
import {
  parseRevocationListPayload,
  parseTrustRegistryPayload,
  verifyRevocationList,
  verifyTrustRegistry,
  type TrustedRoot,
} from "@timedomain/workflowext-verifier";
import { CERT_VALID_FROM, makeTestKeys, type TestKeys } from "./helpers.js";

const NOW = 1_752_969_600;

function registryPayload(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    format: "acestudio.workflowext.trust-registry",
    formatVersion: 1,
    sequence: NOW,
    issuedAt: NOW,
    signedBy: "intermediate-1",
    entries: {
      acestudio: { displayName: "ACE Studio", tier: "official" },
      "partner-co": { displayName: "Partner Co", tier: "verified-partner" },
    },
    ...overrides,
  };
}

function revocationListPayload(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    format: "acestudio.workflowext.revocation-list",
    formatVersion: 1,
    sequence: NOW,
    issuedAt: NOW,
    signedBy: "intermediate-1",
    entries: [
      { scope: "extension", extensionId: "evil.tool", revokedFrom: NOW, reason: "malicious" },
      {
        scope: "extension-version-range",
        extensionId: "partner-co.synth",
        versionRange: { min: "1.0.0", max: "1.4.2" },
        revokedFrom: NOW,
        reason: "compromised",
        note: "leaked CI token",
      },
      { scope: "developer", developerId: "adhoc-3f2b", revokedFrom: NOW, reason: "trust-withdrawn" },
    ],
    ...overrides,
  };
}

async function signedBytes(
  keys: TestKeys,
  payload: Record<string, unknown>,
  chain: SignedEnvelope[] | undefined = undefined,
): Promise<Uint8Array> {
  const envelope = await createSignedEnvelope(
    keys.intermediate.privateKey,
    utf8Encode(JSON.stringify(payload)),
    chain ?? [keys.intermediateCertificate],
  );
  return utf8Encode(JSON.stringify(envelope));
}

async function trustedRoots(keys: TestKeys): Promise<TrustedRoot[]> {
  return [{ keyId: "root-1", publicKey: keys.root.publicKey }];
}

describe("verifyTrustRegistry", () => {
  it("accepts an intermediate-signed registry whose chain resolves to a trusted root", async () => {
    const keys = await makeTestKeys();
    const verdict = await verifyTrustRegistry(await signedBytes(keys, registryPayload()), await trustedRoots(keys));
    expect(verdict.ok).toBe(true);
    if (verdict.ok) {
      expect(verdict.payload.sequence).toBe(NOW);
      expect(verdict.payload.entries.acestudio.tier).toBe("official");
      expect(verdict.certificate.keyId).toBe("intermediate-1");
      expect(verdict.root.keyId).toBe("root-1");
    }
  });

  it("rejects an envelope without a chain — the registry is intermediate-signed", async () => {
    const keys = await makeTestKeys();
    const envelope = await createSignedEnvelope(
      keys.intermediate.privateKey,
      utf8Encode(JSON.stringify(registryPayload())),
    );
    const verdict = await verifyTrustRegistry(
      utf8Encode(JSON.stringify(envelope)),
      await trustedRoots(keys),
    );
    expect(verdict.ok).toBe(false);
    if (!verdict.ok) expect(verdict.reason).toBe("bad-chain");
  });

  it("rejects a chain that resolves under no trusted root", async () => {
    const keys = await makeTestKeys();
    const strangers: TrustedRoot[] = [{ keyId: "other", publicKey: keys.intermediate.publicKey }];
    const verdict = await verifyTrustRegistry(await signedBytes(keys, registryPayload()), strangers);
    expect(verdict.ok).toBe(false);
    if (!verdict.ok) expect(verdict.reason).toBe("bad-chain");
  });

  it("rejects a payload signed by a key other than the certified intermediate", async () => {
    const keys = await makeTestKeys();
    const envelope = await createSignedEnvelope(
      keys.root.privateKey,
      utf8Encode(JSON.stringify(registryPayload())),
      [keys.intermediateCertificate],
    );
    const verdict = await verifyTrustRegistry(
      utf8Encode(JSON.stringify(envelope)),
      await trustedRoots(keys),
    );
    expect(verdict.ok).toBe(false);
    if (!verdict.ok) expect(verdict.reason).toBe("bad-signature");
  });

  it("rejects tampered bytes and non-envelope JSON", async () => {
    const keys = await makeTestKeys();
    const bytes = await signedBytes(keys, registryPayload());
    bytes[bytes.length - 3] ^= 0x01;
    expect((await verifyTrustRegistry(bytes, await trustedRoots(keys))).ok).toBe(false);
    const verdict = await verifyTrustRegistry(utf8Encode("[]"), await trustedRoots(keys));
    expect(verdict.ok).toBe(false);
    if (!verdict.ok) expect(verdict.reason).toBe("malformed-envelope");
  });

  it("rejects a signedBy naming a different key than the certificate certifies", async () => {
    const keys = await makeTestKeys();
    const bytes = await signedBytes(keys, registryPayload({ signedBy: "intermediate-2" }));
    expect(await verifyTrustRegistry(bytes, await trustedRoots(keys))).toEqual({
      ok: false,
      reason: "signer-mismatch",
    });
  });

  it("rejects a registry issued before the signing certificate is valid", async () => {
    const keys = await makeTestKeys();
    const bytes = await signedBytes(keys, registryPayload({ issuedAt: CERT_VALID_FROM - 1 }));
    expect(await verifyTrustRegistry(bytes, await trustedRoots(keys))).toEqual({
      ok: false,
      reason: "signer-not-yet-valid",
    });
  });

  it("rejects structurally invalid payloads that the real intermediate signed", async () => {
    const keys = await makeTestKeys();
    const roots = await trustedRoots(keys);
    const invalid = [
      registryPayload({ sequence: 0 }),
      registryPayload({ format: "acestudio.workflowext.revocation-list" }),
      registryPayload({ entries: { AceStudio: { displayName: "x", tier: "official" } } }),
      registryPayload({ entries: { acestudio: { displayName: "", tier: "official" } } }),
      registryPayload({ entries: { acestudio: { displayName: "x", tier: "ad-hoc" } } }),
      registryPayload({ extra: true }),
    ];
    for (const payload of invalid) {
      expect(await verifyTrustRegistry(await signedBytes(keys, payload), roots)).toEqual({
        ok: false,
        reason: "invalid-payload",
      });
    }
  });
});

describe("verifyRevocationList", () => {
  it("accepts a list with all three entry scopes", async () => {
    const keys = await makeTestKeys();
    const verdict = await verifyRevocationList(
      await signedBytes(keys, revocationListPayload()),
      await trustedRoots(keys),
    );
    expect(verdict.ok).toBe(true);
    if (verdict.ok) {
      expect(verdict.payload.entries).toHaveLength(3);
      expect(verdict.payload.entries[0].reason).toBe("malicious");
    }
  });

  it("accepts an empty list — the day-one served file", async () => {
    const keys = await makeTestKeys();
    const verdict = await verifyRevocationList(
      await signedBytes(keys, revocationListPayload({ entries: [] })),
      await trustedRoots(keys),
    );
    expect(verdict.ok).toBe(true);
  });

  it("rejects structurally invalid entries that the real intermediate signed", async () => {
    const keys = await makeTestKeys();
    const roots = await trustedRoots(keys);
    const base = { scope: "extension", extensionId: "evil.tool", revokedFrom: NOW, reason: "malicious" };
    const invalidEntries: unknown[] = [
      { ...base, scope: "everything" },
      { ...base, reason: "bad-vibes" },
      { ...base, revokedFrom: 1.5 },
      { ...base, extensionId: "com.example.tool.deep" },
      { ...base, note: "x".repeat(1025) },
      { ...base, developerId: "evil" },
      { scope: "extension-version-range", extensionId: "a.b", versionRange: {}, revokedFrom: NOW, reason: "malicious" },
      { scope: "extension-version-range", extensionId: "a.b", versionRange: { min: "v1.0.0" }, revokedFrom: NOW, reason: "malicious" },
      { scope: "developer", developerId: "Evil", revokedFrom: NOW, reason: "malicious" },
    ];
    for (const entry of invalidEntries) {
      const bytes = await signedBytes(keys, revocationListPayload({ entries: [entry] }));
      expect(await verifyRevocationList(bytes, roots)).toEqual({ ok: false, reason: "invalid-payload" });
    }
  });
});

// The verifier hand-rolls the structural checks the schemas publish; these
// suites lock the two to the same verdicts, mirroring schema-agreement.test.ts.
describe("registry parser and schema agree", () => {
  const instances: Array<[string, unknown]> = [
    ["valid registry", registryPayload()],
    ["empty entries", registryPayload({ entries: {} })],
    ["sequence zero", registryPayload({ sequence: 0 })],
    ["fractional issuedAt", registryPayload({ issuedAt: 1.5 })],
    ["uppercase slug key", registryPayload({ entries: { AceStudio: { displayName: "x", tier: "official" } } })],
    ["slug too long", registryPayload({ entries: { ["a".repeat(65)]: { displayName: "x", tier: "official" } } })],
    ["empty displayName", registryPayload({ entries: { acestudio: { displayName: "", tier: "official" } } })],
    ["displayName too long", registryPayload({ entries: { acestudio: { displayName: "x".repeat(129), tier: "official" } } })],
    ["unknown tier", registryPayload({ entries: { acestudio: { displayName: "x", tier: "ad-hoc" } } })],
    ["entry extra key", registryPayload({ entries: { acestudio: { displayName: "x", tier: "official", extra: 1 } } })],
    ["top-level extra key", registryPayload({ extra: true })],
    ["wrong format", registryPayload({ format: "acestudio.workflowext.key-directory" })],
    ["signedBy bad keyId", registryPayload({ signedBy: "-nope" })],
    ["missing entries", { ...registryPayload(), entries: undefined }],
  ];

  const ajv = new Ajv2020({ strict: true, allErrors: true });
  ajv.addSchema(trustRegistrySchema);
  const id = (trustRegistrySchema as { $id: string }).$id;
  const validate = ajv.getSchema(`${id}#/$defs/payload`);
  if (!validate) throw new Error("payload subschema not found");

  it.each(instances)("%s", (_name, instance) => {
    const schemaVerdict = validate(instance) === true;
    const parserVerdict = parseTrustRegistryPayload(utf8Encode(JSON.stringify(instance))) !== null;
    expect(parserVerdict).toBe(schemaVerdict);
  });
});

describe("revocation-list parser and schema agree", () => {
  const entry = (overrides: Record<string, unknown>) => ({
    scope: "extension",
    extensionId: "evil.tool",
    revokedFrom: NOW,
    reason: "malicious",
    ...overrides,
  });
  const instances: Array<[string, unknown]> = [
    ["valid list", revocationListPayload()],
    ["empty list", revocationListPayload({ entries: [] })],
    ["note at limit", revocationListPayload({ entries: [entry({ note: "x".repeat(1024) })] })],
    ["note over limit", revocationListPayload({ entries: [entry({ note: "x".repeat(1025) })] })],
    ["unknown scope", revocationListPayload({ entries: [entry({ scope: "everything" })] })],
    ["unknown reason", revocationListPayload({ entries: [entry({ reason: "bad-vibes" })] })],
    ["fractional revokedFrom", revocationListPayload({ entries: [entry({ revokedFrom: 1.5 })] })],
    ["extension entry with developerId", revocationListPayload({ entries: [entry({ developerId: "evil" })] })],
    ["reverse-domain-deep id", revocationListPayload({ entries: [entry({ extensionId: "com.example.tool.deep" })] })],
    [
      "range with min only",
      revocationListPayload({
        entries: [entry({ scope: "extension-version-range", versionRange: { min: "1.0.0" } })],
      }),
    ],
    [
      "range with max only",
      revocationListPayload({
        entries: [entry({ scope: "extension-version-range", versionRange: { max: "2.0.0-rc.1" } })],
      }),
    ],
    [
      "empty range",
      revocationListPayload({
        entries: [entry({ scope: "extension-version-range", versionRange: {} })],
      }),
    ],
    [
      "range with v-prefixed semver",
      revocationListPayload({
        entries: [entry({ scope: "extension-version-range", versionRange: { min: "v1.0.0" } })],
      }),
    ],
    [
      "range with extra bound key",
      revocationListPayload({
        entries: [entry({ scope: "extension-version-range", versionRange: { min: "1.0.0", exact: "1.2.0" } })],
      }),
    ],
    [
      "developer entry",
      revocationListPayload({
        entries: [{ scope: "developer", developerId: "adhoc-3f2b", revokedFrom: NOW, reason: "developer-request" }],
      }),
    ],
    [
      "developer entry with uppercase slug",
      revocationListPayload({
        entries: [{ scope: "developer", developerId: "Evil", revokedFrom: NOW, reason: "malicious" }],
      }),
    ],
    [
      "developer entry with extensionId",
      revocationListPayload({
        entries: [
          { scope: "developer", developerId: "evil", extensionId: "evil.tool", revokedFrom: NOW, reason: "malicious" },
        ],
      }),
    ],
    ["entries not an array", revocationListPayload({ entries: {} })],
    ["top-level extra key", revocationListPayload({ extra: true })],
  ];

  const ajv = new Ajv2020({ strict: true, allErrors: true });
  ajv.addSchema(revocationListSchema);
  const id = (revocationListSchema as { $id: string }).$id;
  const validate = ajv.getSchema(`${id}#/$defs/payload`);
  if (!validate) throw new Error("payload subschema not found");

  it.each(instances)("%s", (_name, instance) => {
    const schemaVerdict = validate(instance) === true;
    const parserVerdict = parseRevocationListPayload(utf8Encode(JSON.stringify(instance))) !== null;
    expect(parserVerdict).toBe(schemaVerdict);
  });
});
