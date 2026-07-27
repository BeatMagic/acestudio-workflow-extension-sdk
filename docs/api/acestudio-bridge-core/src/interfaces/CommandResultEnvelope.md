# Interface: CommandResultEnvelope\<T\>

What one operation answers: either `data` (optionally with `warnings`) or
`error`, never both.

## Type Parameters

### T

`T` = `unknown`

## Properties

### data?

```ts
optional data?: T;
```

***

### error?

```ts
optional error?: CommandErrorPayload;
```

***

### warnings?

```ts
optional warnings?: readonly CommandWarning[];
```
