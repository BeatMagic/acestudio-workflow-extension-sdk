import { describe, expect, it } from "vitest";
import { Ajv2020 } from "ajv/dist/2020.js";
import { utf8Encode } from "@beatmagic/workflowext-signed-json";
import { signatureBlockSchema } from "@beatmagic/workflowext-wire-schemas";
import { parseSignatureBlockPayload } from "@beatmagic/workflowext-verifier";

// The verifier hand-rolls the structural checks the schema publishes (the C++
// client will too). This suite locks the two to the same verdicts.
const SHA256 = "c".repeat(64);

const valid = {
  format: "acestudio.workflowext.signature-block",
  formatVersion: 1,
  extensionId: "acestudio.mv-runtime",
  developerId: "acestudio",
  version: "1.2.3-beta.1+build.5",
  signedAt: 1752710400,
  files: { "manifest.json": SHA256, "dist/index.js": SHA256 },
};

const instances: Array<[string, unknown]> = [
  ["valid payload", valid],
  ["single-file payload", { ...valid, files: { "manifest.json": SHA256 } }],
  ["wrong format", { ...valid, format: "acestudio.workflowext.certificate" }],
  ["wrong formatVersion", { ...valid, formatVersion: 2 }],
  ["reverse-domain id", { ...valid, extensionId: "com.example.tool" }],
  ["dotless id", { ...valid, extensionId: "just-a-slug" }],
  ["uppercase developer", { ...valid, developerId: "AceStudio" }],
  ["non-semver version", { ...valid, version: "1.2" }],
  ["semver with v prefix", { ...valid, version: "v1.2.3" }],
  ["fractional signedAt", { ...valid, signedAt: 1.5 }],
  ["negative signedAt", { ...valid, signedAt: -1 }],
  ["empty files", { ...valid, files: {} }],
  ["absolute path", { ...valid, files: { "/abs.js": SHA256 } }],
  ["trailing slash path", { ...valid, files: { "dir/": SHA256 } }],
  ["dot-segment path", { ...valid, files: { "a/../b.js": SHA256 } }],
  ["reserved _signature path", { ...valid, files: { "_signature/block.json": SHA256 } }],
  ["backslash path", { ...valid, files: { "a\\b.js": SHA256 } }],
  ["short digest", { ...valid, files: { "manifest.json": "abc" } }],
  ["uppercase digest", { ...valid, files: { "manifest.json": SHA256.toUpperCase() } }],
  ["missing files", { ...valid, files: undefined }],
  ["extra property", { ...valid, publisher: "ACE Studio" }],
];

describe("verifier and schema agree on payload structure", () => {
  const ajv = new Ajv2020({ strict: true, allErrors: true });
  ajv.addSchema(signatureBlockSchema);
  const id = (signatureBlockSchema as { $id: string }).$id;
  const validateWithSchema = ajv.getSchema(`${id}#/$defs/payload`);
  if (!validateWithSchema) throw new Error("payload subschema not found");

  it.each(instances)("%s", (_name, instance) => {
    const schemaVerdict = validateWithSchema(instance) === true;
    const verifierVerdict =
      parseSignatureBlockPayload(utf8Encode(JSON.stringify(instance))) !== null;
    expect(verifierVerdict).toBe(schemaVerdict);
  });
});
