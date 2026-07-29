# Type Alias: EventsOf\<P\>

```ts
type EventsOf<P> = P["events"] extends UiEvents ? P["events"] : Record<never, never>;
```

The `events` half of a protocol, with the absent case filled in.

## Type Parameters

### P

`P` *extends* [`UiProtocol`](../interfaces/UiProtocol.md)
