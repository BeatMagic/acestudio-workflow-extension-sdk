# Interface: HistoryListParams

Arguments for `history list`.

## Properties

### limit?

```ts
optional limit?: number;
```

Return only the newest N entries, at least 1. Omitted lists the whole stack, which has no size cap and grows for as long as the project stays open. A non-positive value is refused rather than clamped: the floor is part of the contract, and clamping would answer a question the caller did not ask.
