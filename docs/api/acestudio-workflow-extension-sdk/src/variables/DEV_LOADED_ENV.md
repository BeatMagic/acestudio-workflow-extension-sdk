# Variable: DEV\_LOADED\_ENV

```ts
const DEV_LOADED_ENV: "ACE_EXTENSION_DEV_LOADED" = "ACE_EXTENSION_DEV_LOADED";
```

Set when ACE Studio loaded this extension from a working folder rather than from an
installed bundle — a *dev-loaded* extension, as ADR 0091 §1 defines one.

It is what gates the developer affordances that must not reach a user's machine —
`ui.devServerUrl` above all. Nothing an extension ships can set it for itself,
because the spawn environment is the host's to compose.

The rule it enforces is ADR 0094 §11's; the variable carrying the host's answer is
this SDK's own, and no ADR names it yet.
