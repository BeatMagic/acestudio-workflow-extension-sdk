# @beatmagic/workflowext-verifier

The reference verifier: implements the **client** verification policy so every
service test asserts what a real client will conclude, not what the server
intended. Service tests hammer the public API and judge outputs through this
package's verdicts.

Scope: chain resolution to embedded root public keys, verify-before-parse over
exact bytes, and two-way per-file SHA-256 coverage — no smuggled files, no
missing files, `_signature/` reserved. Sequence-ratchet comparison, revocation
matching, and root-revocation ratcheting are covered alongside the trust-file
support.

## Golden vectors

`vectors/` holds golden byte-stability artifacts (a signed mini-bundle and its
intermediate certificate), rebuilt from fixed throwaway seeds and byte-compared
on every test run — signatures cover exact stored bytes, so a construction
change that shifts one byte is a wire change and fails the suite. After an
*intended* wire change:

```sh
UPDATE_GOLDEN_VECTORS=1 npx vitest run --project packages
```

and review the vector diff as a contract change. The keys are RFC 8032 test
seeds; no shipped client ever trusts them.
