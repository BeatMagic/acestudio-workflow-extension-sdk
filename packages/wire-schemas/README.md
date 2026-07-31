# @timedomain/workflowext-wire-schemas

The JSON Schemas for the files that let ACE Studio tell a genuine extension from a
tampered one: the signature that travels with a bundle, the certificates behind that
signature, and the trust and revocation files the app reads to decide who it believes.

A supporting package, and the **normative contract**: ACE Studio's own verification
module is written against these schemas, so treat any change to a published one as
breaking for it. A schema is frozen once something consumes it, and evolution means a
new `*.v2.schema.json`, never an edit to v1.

## The six formats

| Schema | Signed by | Envelope chain |
|---|---|---|
| `signature-block.v1` | intermediate | required (1 cert) |
| `certificate-statement.v1` | root | none |
| `key-directory.v1` | root | none |
| `trust-registry.v1` | intermediate | required (1 cert) |
| `revocation-list.v1` | intermediate | required (1 cert) |
| `root-revocation-statement.v1` | root | none |

## Reading a schema

Every signed artifact is the same envelope shape: `payload` (base64 of the
exact signed bytes), `signature`, and — for intermediate-signed artifacts —
`chain`. The schema **root** validates that wire envelope; the decoded payload
object is pinned at **`#/$defs/payload`** in the same file. Verifiers check
the Ed25519 signature over the exact payload bytes first and parse after —
never re-serialize, no canonicalization anywhere.

## Conventions pinned by every schema

- **base64**: standard alphabet, with padding.
- **Hashes**: SHA-256, lowercase hex.
- **Timestamps** (`signedAt`, `issuedAt`, `validFrom`, `revokedFrom`): Unix
  time in seconds, UTC, as JSON integers.
- **Domain separation**: every payload carries `format` + `formatVersion`, so
  a signature over one statement type can never be replayed as another.
- **Closed contract**: payloads reject unknown properties.
- **Version ordering**: bundle versions are SemVer 2.0.0; the revocation-list
  schema's `versionRange` definition is the normative comparison rule.
