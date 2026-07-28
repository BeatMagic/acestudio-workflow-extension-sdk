# Type Alias: Unsubscribe

```ts
type Unsubscribe = () => void;
```

Stop listening. Calling it more than once is harmless; a subscription dropped this way never fires again, including for a notification already in flight.

## Returns

`void`
