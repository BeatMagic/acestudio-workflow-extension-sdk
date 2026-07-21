# @timedomain/workflowext-signed-json

Signed-JSON primitives shared by the signing pipeline and the reference
verifier: Ed25519 and SHA-256 via WebCrypto only — no custom crypto — over
**exact stored bytes**, with verify-before-parse and no canonicalization step
anywhere. Also home to the certificate statement
(`{format, formatVersion, keyId, publicKey, role, validFrom, signedBy}` +
envelope signature), the "no X.509" certificate.

Runs identically on Node (≥ 24) and the Workers runtime.
