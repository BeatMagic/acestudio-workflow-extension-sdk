# Interface: InvokeWarning

An advisory fact about a completed operation (ADR 0083 §2): something worth
telling the caller that did not stop the work. Mirrors the error envelope —
a stable code, an optional hint — and is never stripped at the wire level.

## Properties

### code

```ts
code: string;
```

Stable SCREAMING_SNAKE identifier from the canonical registry.

***

### hint?

```ts
optional hint?: string;
```

Optional recovery advice, composed where the warning was raised.
