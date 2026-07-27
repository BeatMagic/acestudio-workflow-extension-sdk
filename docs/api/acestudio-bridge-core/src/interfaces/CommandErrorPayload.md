# Interface: CommandErrorPayload

A refused operation. `code` is the canonical error code, `hint` the recovery
advice composed where the refusal happened.

## Properties

### code

```ts
code: string;
```

***

### details?

```ts
optional details?: Record<string, unknown>;
```

***

### hint?

```ts
optional hint?: string;
```

***

### message

```ts
message: string;
```
