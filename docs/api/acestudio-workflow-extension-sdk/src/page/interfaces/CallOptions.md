# Interface: CallOptions

Per-call options.

## Properties

### signal?

```ts
readonly optional signal?: AbortSignal;
```

Abort the call. What the process already started is not undone by aborting.
