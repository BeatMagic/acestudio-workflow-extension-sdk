# Trusted roots

`production.json` holds the root public keys this CLI ships with — the trust
anchor `verify` (and `sign`'s self-verify) checks a signed bundle's chain
against. Format matches the service's `ROOT_PUBLIC_KEYS` and the golden
vectors:

```json
[{ "keyId": "root-1", "publicKey": "<base64 of the raw 32-byte Ed25519 key>" }]
```

It ships **empty** until the production signing ceremony publishes its root
public key. While empty, the default trust anchor is unset: `verify` and
`sign` fail closed unless you pass `--roots <file>` (e.g. the dev root while
testing against the dev service). A root public key is publishable — this is a
data update, not a code change, the moment the ceremony's root is available.
