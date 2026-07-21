# @beatmagic/aceworkflow

The ACE Studio workflow-extension CLI. A pure client of the signing service's
submission API: it packs a `.aceworkflow` bundle, submits it to be signed, and
verifies the signed result with the reference verifier — nothing the API
cannot already do.

## Commands

```
aceworkflow pack   <dir> [-o <out.aceworkflow>]     pack a source tree (local, deterministic)
aceworkflow submit <bundle.aceworkflow> [-o <out>]  submit a prebuilt bundle to be signed
aceworkflow verify <bundle.aceworkflow> [--roots <file>]   check a signed bundle
aceworkflow sign   <dir|bundle> [-o <out>] [--roots <file>]   pack → submit → self-verify → write

aceworkflow login  [--token <bearer> | --ad-hoc]    store a credential for a service
aceworkflow logout                                  forget the stored credential
aceworkflow whoami                                  show the resolved credential
```

Global options: `--service <url>` (defaults to production), `--token <bearer>`,
`--roots <file>` (trust anchor for `verify` and `sign`'s self-verify),
`--json`, `--quiet`, `-y/--yes`, `--help`, `--version`.

## Credentials

One bearer credential resolves in order: `--token` → `ACEWORKFLOW_TOKEN` → the
stored credential → an interactive prompt. The service decides whether a bearer
is a registered API token or an ad-hoc secret; the client never declares a
kind. `--ad-hoc` means "mint an anonymous identity if I have none". The env var
always wins and is never persisted — that is the CI and agent path.

Stored credentials go in the OS keychain (macOS Keychain, Windows Credential
Manager, Linux Secret Service) when one is available, and fall back to a
`0600` file under the OS app-data directory otherwise — Git's credential-helper
model. Either way they are keyed by service origin, so a production bearer and
a dev bearer never collide. Set `ACEWORKFLOW_CREDENTIAL_STORE=file` to force the
file store (useful in CI images).

## Targeting a service

Production is compiled in and silent. `--service <url>` or `ACEWORKFLOW_SERVICE`
overrides it with any URL, and an override is always announced (on stderr, even
under `--json`/`--quiet`) so a command can never quietly hit a non-production
backend.

For a name you use often, define an alias in `config.json` (in the OS app-data
directory) and pass it to `--service`:

```json
{ "services": { "dev": "https://…" } }
```

`--service dev` then resolves from your own config — no non-production host is
baked into this package.

## Non-interactive use

A non-TTY session never prompts; `-y` forces the same. `--json` emits a single
machine-readable object on stdout on every path — a result on success,
`{ error, code }` on failure — and the process exit code maps the service's
own refusal codes (see `ExitCode`).
