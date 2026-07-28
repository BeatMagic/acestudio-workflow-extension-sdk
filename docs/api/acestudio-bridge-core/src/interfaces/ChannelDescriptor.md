# Interface: ChannelDescriptor

What one observable channel is, for the runtime that binds the subscriptions below onto a connection. One wire notification carries every channel, so the runtime demultiplexes on `channel` and guards the subscribe with `capability` — the same refusal a call to an ungranted operation raises, so an extension learns at the subscribe rather than waiting for a callback that never fires.

## Properties

### capability

```ts
readonly capability: string;
```

The capability a subscription to this channel requires.

***

### channel

```ts
readonly channel: string;
```

Channel name as it travels in the notification envelope.

***

### domain

```ts
readonly domain: string;
```

Domain group the subscription nests under; never empty.

***

### method

```ts
readonly method: string;
```

Binding method name for the subscription.
