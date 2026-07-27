# Type Alias: DetailsFor\<C\>

```ts
type DetailsFor<C> = C extends keyof BridgeErrorDetails ? BridgeErrorDetails[C] : Record<string, unknown>;
```

What `details` holds for one code: the declared shape when there is one,
and a plain object otherwise.

## Type Parameters

### C

`C` *extends* [`AnyBridgeErrorCode`](AnyBridgeErrorCode.md)
