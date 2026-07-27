# Interface: RequestOptions

Bounds one outbound call.

## Properties

### signal?

```ts
optional signal?: AbortSignal;
```

Abort the local wait. The host-side work is unaffected.

***

### timeoutMs?

```ts
optional timeoutMs?: number;
```

Local deadline in milliseconds. The host-side work is unaffected.
