# acestudio-workflow-extension-sdk
The official open-source SDK and tooling for building ACE Studio workflow extensions.

## Packages

The extension SDK:

| Package                                 | Role                                                                    |
| --------------------------------------- | ----------------------------------------------------------------------- |
| `@timedomain/acestudio-extension-sdk`   | The SDK for building extensions: `defineExtension`, lifecycle, UI       |
| `@timedomain/acestudio-bridge-core`     | The connection core beneath the SDK: handshake, bindings, jobs, errors  |
| `@timedomain/create-acestudio-extension`| The `npm create`-native scaffolder for a new extension                  |

Signing and submission tooling:

| Package                                 | Role                                                                    |
| --------------------------------------- | ----------------------------------------------------------------------- |
| `@timedomain/aceworkflow`               | The `aceworkflow` CLI: pack, submit, and verify bundles                 |
| `@timedomain/workflowext-verifier`      | Reference verifier for the client verification policy                   |
| `@timedomain/workflowext-signed-json`   | Signed-JSON primitives (Ed25519 over exact stored bytes)                |
| `@timedomain/workflowext-wire-schemas`  | Versioned JSON Schemas for the wire formats                             |

## Development

Requires Node ≥ 24. Packages run from TypeScript source — no build step for
day-to-day work.

```sh
npm install       # install workspace dependencies
npm run typecheck # tsc --noEmit
npm test          # vitest
npm run build     # bundle every package to dist/ (see CONTRIBUTING.md)
npm run validate  # the full quality pipeline CI runs
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the development workflow, the
validate pipeline, and build details.
