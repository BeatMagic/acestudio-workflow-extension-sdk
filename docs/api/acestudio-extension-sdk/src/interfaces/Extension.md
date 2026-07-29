# Interface: Extension\<M\>

A defined extension. The entry module's default export, so that importing it is
enough to start the run — there is nothing for a caller to call, because the only
caller is ACE Studio spawning the process.

## Type Parameters

### M

`M` *extends* [`ExtensionManifest`](ExtensionManifest.md) = [`ExtensionManifest`](ExtensionManifest.md)

## Properties

### exitCode

```ts
readonly exitCode: Promise<number>;
```

The code the run exits with, once it is over. Never rejects — a failure is
logged where ACE Studio captures it, and reported as the code:

- `0` — the run finished, or was stopped, cleanly.
- `1` — a handler threw.
- `2` — the run never started: no spawn environment, an unknown command, a
  refused handshake.
- `3` — the bridge closed under a running extension.

***

### manifest

```ts
readonly manifest: M;
```

The manifest this extension was defined with.
