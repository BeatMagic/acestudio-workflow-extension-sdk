# Type Alias: UiEvents

```ts
type UiEvents = Readonly<Record<string, unknown>>;
```

The process→page pushes, as a map from event name to payload type. A payload of
`void` is an event that carries nothing.
