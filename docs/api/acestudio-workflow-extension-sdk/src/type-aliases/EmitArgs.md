# Type Alias: EmitArgs\<Payload\>

```ts
type EmitArgs<Payload> = [Payload] extends [void] ? [] : [Payload];
```

What `emit` takes beside the event name: the declared payload, or nothing at all
when the event declares `void`.

## Type Parameters

### Payload

`Payload`
