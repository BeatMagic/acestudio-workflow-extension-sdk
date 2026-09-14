# Interface: VocalparamLayersParams

Arguments for `vocalparam layers`.

## Properties

### clipUuid

```ts
clipUuid: string;
```

Clip id, as reported by `clip list` (braced form).

***

### param?

```ts
optional param?: string;
```

Report only this parameter instead of the whole matrix. Naming a parameter the roster does not list — one the project's vocal-control route excludes, or one the singer does not publish — is refused with the reason, the same as on `read` and `write`.
