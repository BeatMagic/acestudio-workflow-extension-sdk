# Trusted roots

`production.json` holds the root public keys this CLI ships with — the trust
anchor `verify` (and `sign`'s self-verify) checks a signed bundle's chain
against. Format matches the service's `ROOT_PUBLIC_KEYS` and the golden
vectors:

```json
[{ "keyId": "root-1", "publicKey": "<base64 of the raw 32-byte Ed25519 key>" }]
```

A root **public** key is publishable — it is the trust anchor every client
embeds, not a secret. Adding or rotating one is a data change here, reviewed
like any other. The private root key lives only in the offline signing
ceremony and never touches this repository.

Pass `--roots <file>` to check against a different anchor — e.g. a
non-production environment's root while testing.
