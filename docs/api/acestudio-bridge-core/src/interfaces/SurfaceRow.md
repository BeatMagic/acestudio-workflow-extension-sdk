# Interface: SurfaceRow

What scoping needs from a generated row: the domain it nests under, the member it
becomes, and the token that reaches it.

A bound rather than a descriptor, and deliberately a small one, because both
`OperationDescriptor` and `ChannelDescriptor` have to satisfy it. A profile's reach
covers a domain's subscriptions as much as its calls — `canvas.changed` is gated by
`canvas.read`, the same token `canvas info` needs — so a facade admitting only
operations reports a granted channel as absent. Rows carrying `ungated` are still
read for it; a channel declares no such field and so is never ungated, which is
correct: there is no unguarded subscription.

## Properties

### capability

```ts
readonly capability: string;
```

The capability a session needs to reach it.

***

### domain

```ts
readonly domain: string;
```

Domain group the member nests under; empty for a root-level one.

***

### method

```ts
readonly method: string;
```

The binding member this row becomes — a verb, or a subscription.
