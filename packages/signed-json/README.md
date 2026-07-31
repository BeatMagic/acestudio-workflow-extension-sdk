# @timedomain/workflowext-signed-json

Sign a JSON document with Ed25519, and verify one, over the **exact stored bytes**:
nothing is re-serialized, nothing is canonicalized, and nothing is parsed until the
signature over it holds.

A supporting library. It exists because ACE Studio's signing pipeline and its
reference verifier have to agree byte for byte on what was signed, and both build on
this. Ed25519 and SHA-256 via WebCrypto only, no custom crypto. Also home to the
certificate statement
(`{format, formatVersion, keyId, publicKey, role, validFrom, signedBy}` +
envelope signature), the "no X.509" certificate.

Runs identically on Node (≥ 24) and the Workers runtime.
