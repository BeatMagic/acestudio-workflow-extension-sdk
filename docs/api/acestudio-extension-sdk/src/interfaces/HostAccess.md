# Interface: HostAccess

The second axis of what an extension may do, beside its capability tokens: what
its process may touch. A capability token gates an operation on the bridge; a
host-access declaration gates the process itself.

Every latch is a real ability some extensions genuinely need, off by default and
consented at install with an honest warning — the declaration exists so the
author states what they use and the user sees what they are allowing, not to
gatekeep. The latches are orthogonal: turning one on never widens
[HostAccess.filesystem](#filesystem).

## Properties

### childProcess?

```ts
readonly optional childProcess?: boolean;
```

Run other programs. What they touch is outside the declared file scopes.

***

### filesystem?

```ts
readonly optional filesystem?: FilesystemAccess;
```

Filesystem reach beyond the extension's own data, scratch, and log folders.

***

### nativeAddons?

```ts
readonly optional nativeAddons?: boolean;
```

Load native (`.node`) modules, which run outside the declared limits.

***

### wasi?

```ts
readonly optional wasi?: boolean;
```

Use the WebAssembly System Interface.

***

### workers?

```ts
readonly optional workers?: boolean;
```

Run worker threads.
