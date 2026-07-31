# @timedomain/workflowext-verifier

Checks that an ACE Studio extension really came from the publisher it names and that
nothing in it changed after it was signed.

A supporting package, and the reference implementation of that check: it applies the
**client** policy, so the signing service's own tests can assert what a real client
will conclude rather than what the server intended. Service tests hammer the public
API and judge the outputs through this package's verdicts.

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
