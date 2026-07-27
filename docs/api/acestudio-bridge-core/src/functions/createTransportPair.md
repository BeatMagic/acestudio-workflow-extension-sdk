# Function: createTransportPair()

```ts
function createTransportPair(): TransportPair;
```

Build a connected pair of in-memory transports — the seam a test drives the
whole stack over, with no socket and no Studio process.

Delivery is asynchronous (a microtask), so neither end can observe a message
arriving inside its own `send()` — the same ordering a real socket gives.

## Returns

[`TransportPair`](../interfaces/TransportPair.md)
