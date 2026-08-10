# Interface: TimesigRemoveAtParams

Arguments for `timesig remove-at`.

## Properties

### barPos

```ts
barPos: number;
```

The same bar counted from 0, as the project stores it and as `convert` reports it. This is the spelling the wire takes. `acestudio-cli` and MCP also accept `bar` counting from 1; pass one or the other, never both.
