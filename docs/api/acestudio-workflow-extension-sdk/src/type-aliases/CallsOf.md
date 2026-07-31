# Type Alias: CallsOf\<P\>

```ts
type CallsOf<P> = P["calls"] extends UiCalls ? P["calls"] : Record<never, never>;
```

The `calls` half of a protocol, with the absent case filled in.

## Type Parameters

### P

`P` *extends* [`UiProtocol`](../interfaces/UiProtocol.md)
