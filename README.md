# acestudio-workflow-extension-sdk
The official open-source SDK and tooling for building ACE Studio workflow extensions.

## Packages

| Package                               | Role                                                      |
| ------------------------------------- | --------------------------------------------------------- |
| `@timedomain/aceworkflow`             | The `aceworkflow` CLI: pack, submit, and verify bundles   |
| `@timedomain/workflowext-verifier`    | Reference verifier for the client verification policy     |
| `@timedomain/workflowext-signed-json` | Signed-JSON primitives (Ed25519 over exact stored bytes)  |
| `@timedomain/workflowext-wire-schemas`| Versioned JSON Schemas for the wire formats               |

## Development

Requires Node ≥ 24. Packages run from TypeScript source — no build step for
day-to-day work.

```sh
npm install       # install workspace dependencies
npm run typecheck # tsc --noEmit
npm test          # vitest
npm run build     # bundle every package to dist/ (see PUBLISHING.md)
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the development workflow and build details.
