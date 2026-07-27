# Interface: InvokeCommandParams

`bridge.invokeCommand` arguments. `path` is the canonical operation path
(`"transport set-loop"`, `"editor add-notes"`); `arguments` is the shape the
operation's schema describes.

## Properties

### arguments

```ts
arguments: Record<string, unknown>;
```

***

### path

```ts
path: string;
```

***

### waitTimeoutMs?

```ts
optional waitTimeoutMs?: number;
```

Bounded wait for the busy gate; absent fails fast with `USER_BUSY`.
