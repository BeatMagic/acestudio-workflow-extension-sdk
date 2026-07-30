import { describe, expect, it } from "vitest";
import { Ajv2020 } from "ajv/dist/2020.js";
import {
  ALL_SCHEMAS,
  certificateStatementSchema,
  keyDirectorySchema,
  revocationListSchema,
  rootRevocationStatementSchema,
  signatureBlockSchema,
  trustRegistrySchema,
} from "@timedomain/workflowext-wire-schemas";

// 44-char base64 (32 bytes) / 88-char base64 (64 bytes) stand-ins.
const B64_32BYTES = "A".repeat(43) + "=";
const B64_SIG = "B".repeat(86) + "==";
const SHA256 = "c".repeat(64);

const certificateEnvelope = { payload: B64_32BYTES, signature: B64_SIG };

function compile(schema: object) {
  const ajv = new Ajv2020({ strict: true, allErrors: true });
  return ajv.compile(schema);
}

function compilePayload(schema: { $defs?: object }) {
  const ajv = new Ajv2020({ strict: true, allErrors: true });
  ajv.addSchema(schema as object);
  const id = (schema as { $id: string }).$id;
  const validate = ajv.getSchema(`${id}#/$defs/payload`);
  if (!validate) throw new Error(`schema ${id} has no #/$defs/payload`);
  return validate;
}

describe("all six schemas", () => {
  it("compile under ajv 2020 strict mode", () => {
    for (const schema of ALL_SCHEMAS) {
      expect(() => compile(schema)).not.toThrow();
    }
  });

  it("have distinct versioned $ids", () => {
    const ids = ALL_SCHEMAS.map((s) => (s as { $id: string }).$id);
    expect(new Set(ids).size).toBe(6);
    for (const id of ids) expect(id).toMatch(/\.v1\.schema\.json$/);
  });
});

describe("signature block schema", () => {
  const validEnvelope = {
    payload: B64_32BYTES,
    signature: B64_SIG,
    chain: [certificateEnvelope],
  };
  const validPayload = {
    format: "acestudio.workflowext.signature-block",
    formatVersion: 1,
    extensionId: "acestudio.mv-runtime",
    developerId: "acestudio",
    class: "registered",
    version: "1.2.3",
    signedAt: 1752710400,
    files: {
      "manifest.json": SHA256,
      "dist/index.js": SHA256,
    },
  };

  it("accepts a valid envelope and payload", () => {
    expect(compile(signatureBlockSchema)(validEnvelope)).toBe(true);
    expect(compilePayload(signatureBlockSchema)(validPayload)).toBe(true);
  });

  it("requires the cert chain on the envelope", () => {
    expect(compile(signatureBlockSchema)({ payload: B64_32BYTES, signature: B64_SIG })).toBe(false);
  });

  it("rejects reverse-domain extension ids", () => {
    const validate = compilePayload(signatureBlockSchema);
    expect(validate({ ...validPayload, extensionId: "com.example.tool" })).toBe(false);
    expect(validate({ ...validPayload, extensionId: "no-dot" })).toBe(false);
  });

  it("accepts the ad-hoc provenance class and rejects unknown ones", () => {
    const validate = compilePayload(signatureBlockSchema);
    expect(validate({ ...validPayload, class: "ad-hoc" })).toBe(true);
    expect(validate({ ...validPayload, class: "notarized" })).toBe(false);
    const { class: _, ...withoutClass } = validPayload;
    expect(validate(withoutClass)).toBe(false);
  });

  it("rejects non-SemVer versions", () => {
    const validate = compilePayload(signatureBlockSchema);
    expect(validate({ ...validPayload, version: "1.2" })).toBe(false);
    expect(validate({ ...validPayload, version: "v1.2.3" })).toBe(false);
  });

  it("rejects traversal-shaped or absolute file paths and the signature block itself", () => {
    const validate = compilePayload(signatureBlockSchema);
    for (const path of ["../evil.js", "a/../b.js", "/abs.js", "a//b.js", "_signature/block.json"]) {
      expect(validate({ ...validPayload, files: { [path]: SHA256 } }), path).toBe(false);
    }
  });

  it("rejects an empty file map and non-hex digests", () => {
    const validate = compilePayload(signatureBlockSchema);
    expect(validate({ ...validPayload, files: {} })).toBe(false);
    expect(validate({ ...validPayload, files: { "manifest.json": "UPPER".padEnd(64, "C") } })).toBe(false);
  });
});

describe("certificate statement schema", () => {
  const validPayload = {
    format: "acestudio.workflowext.certificate",
    formatVersion: 1,
    keyId: "intermediate-1",
    publicKey: B64_32BYTES,
    role: "intermediate",
    validFrom: 1752710400,
    signedBy: "root-1",
  };

  it("accepts a valid statement", () => {
    expect(compile(certificateStatementSchema)(certificateEnvelope)).toBe(true);
    expect(compilePayload(certificateStatementSchema)(validPayload)).toBe(true);
  });

  it("rejects a chain on the certificate envelope (certs are root-signed directly)", () => {
    expect(
      compile(certificateStatementSchema)({ ...certificateEnvelope, chain: [certificateEnvelope] }),
    ).toBe(false);
  });

  it("rejects unknown roles", () => {
    expect(compilePayload(certificateStatementSchema)({ ...validPayload, role: "leaf" })).toBe(false);
  });
});

describe("key directory schema", () => {
  const validPayload = {
    format: "acestudio.workflowext.key-directory",
    formatVersion: 1,
    sequence: 1752710400,
    issuedAt: 1752710400,
    signedBy: "root-1",
    intermediates: [certificateEnvelope],
    revokedIntermediates: [{ keyId: "intermediate-0", revokedFrom: 1752710000 }],
    rootRevocations: [certificateEnvelope],
  };

  it("accepts a valid directory and rejects a chain on its envelope", () => {
    expect(compile(keyDirectorySchema)(certificateEnvelope)).toBe(true);
    expect(compile(keyDirectorySchema)({ ...certificateEnvelope, chain: [] })).toBe(false);
    expect(compilePayload(keyDirectorySchema)(validPayload)).toBe(true);
  });

  it("rejects a non-positive sequence", () => {
    expect(compilePayload(keyDirectorySchema)({ ...validPayload, sequence: 0 })).toBe(false);
  });

  it("requires the rootRevocations travel slot (ADR 0089 §2)", () => {
    const { rootRevocations: _dropped, ...withoutSlot } = validPayload;
    expect(compilePayload(keyDirectorySchema)(withoutSlot)).toBe(false);
    expect(compilePayload(keyDirectorySchema)({ ...validPayload, rootRevocations: [] })).toBe(true);
  });
});

describe("trust registry schema", () => {
  const validPayload = {
    format: "acestudio.workflowext.trust-registry",
    formatVersion: 1,
    sequence: 1752710401,
    issuedAt: 1752710401,
    signedBy: "intermediate-1",
    entries: {
      acestudio: { displayName: "ACE Studio", tier: "official" },
      "partner-co": { displayName: "Partner Co", tier: "verified-partner" },
    },
  };

  it("accepts a valid registry (envelope carries the intermediate chain)", () => {
    expect(
      compile(trustRegistrySchema)({ ...certificateEnvelope, chain: [certificateEnvelope] }),
    ).toBe(true);
    expect(compilePayload(trustRegistrySchema)(validPayload)).toBe(true);
  });

  it("rejects tiers outside the closed enum — elevated tiers only", () => {
    const validate = compilePayload(trustRegistrySchema);
    expect(
      validate({
        ...validPayload,
        entries: { acestudio: { displayName: "ACE Studio", tier: "unsigned" } },
      }),
    ).toBe(false);
  });
});

describe("revocation list schema", () => {
  const validPayload = {
    format: "acestudio.workflowext.revocation-list",
    formatVersion: 1,
    sequence: 1752710402,
    issuedAt: 1752710402,
    signedBy: "intermediate-1",
    entries: [
      { scope: "extension", extensionId: "evil-dev.bad-tool", revokedFrom: 1752710000, reason: "malicious" },
      {
        scope: "extension-version-range",
        extensionId: "some-dev.tool",
        versionRange: { min: "1.0.0", max: "1.4.2" },
        revokedFrom: 1752710000,
        reason: "compromised",
        note: "leaked token window",
      },
      { scope: "developer", developerId: "gone-dev", revokedFrom: 1752710000, reason: "trust-withdrawn" },
    ],
  };

  it("accepts all three scopes", () => {
    expect(compilePayload(revocationListSchema)(validPayload)).toBe(true);
  });

  it("rejects reasons outside the closed enum", () => {
    expect(
      compilePayload(revocationListSchema)({
        ...validPayload,
        entries: [{ scope: "developer", developerId: "x", revokedFrom: 1, reason: "spite" }],
      }),
    ).toBe(false);
  });

  it("rejects a version-range entry with neither bound", () => {
    expect(
      compilePayload(revocationListSchema)({
        ...validPayload,
        entries: [
          {
            scope: "extension-version-range",
            extensionId: "some-dev.tool",
            versionRange: {},
            revokedFrom: 1,
            reason: "compromised",
          },
        ],
      }),
    ).toBe(false);
  });

  it("rejects scope/field mismatches", () => {
    const validate = compilePayload(revocationListSchema);
    expect(
      validate({
        ...validPayload,
        entries: [{ scope: "developer", extensionId: "a.b", revokedFrom: 1, reason: "malicious" }],
      }),
    ).toBe(false);
  });

  it("pins the SemVer comparison rule in the schema text", () => {
    expect(JSON.stringify(revocationListSchema)).toContain("SemVer 2.0.0");
  });
});

describe("root revocation statement schema", () => {
  const validPayload = {
    format: "acestudio.workflowext.root-revocation",
    formatVersion: 1,
    revokedKeyId: "root-1",
    revokedFrom: 1752710400,
    reason: "custodian machine compromised",
    signedBy: "root-2",
  };

  it("accepts a valid statement and rejects a chain on its envelope", () => {
    expect(compile(rootRevocationStatementSchema)(certificateEnvelope)).toBe(true);
    expect(
      compile(rootRevocationStatementSchema)({ ...certificateEnvelope, chain: [] }),
    ).toBe(false);
    expect(compilePayload(rootRevocationStatementSchema)(validPayload)).toBe(true);
  });

  it("rejects an empty reason", () => {
    expect(
      compilePayload(rootRevocationStatementSchema)({ ...validPayload, reason: "" }),
    ).toBe(false);
  });
});
