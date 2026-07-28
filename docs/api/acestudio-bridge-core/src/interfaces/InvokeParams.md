# Interface: InvokeParams

Parameters of `operation.invoke`.

## Properties

### arguments

```ts
arguments: unknown;
```

The operation's arguments, shaped by its declared input schema.

The stale-write fingerprint rides in here too, under the reserved
`fingerprint` key rather than on the envelope — the canonical placement
every consumer surface copies (ADR 0088 §5).

***

### path

```ts
path: string;
```

The canonical operation path, exactly as the operation tree spells it
(`"track list"`, `"clip move-edges"`). Not a wire method name — an
unknown path answers UNKNOWN_COMMAND.

***

### waitTimeoutMs?

```ts
optional waitTimeoutMs?: number;
```

Bounded busy-gate wait in milliseconds (ADR 0088 §4): a mutating call
landing while the user owns the model parks up to this long for the
busy -\> idle edge instead of failing. Absent is fail-fast — the host
answers USER_BUSY rather than leaving a scripted caller hanging.
