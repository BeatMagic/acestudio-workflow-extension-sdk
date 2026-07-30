# Interface: HistoryListParams

Arguments for `history list`.

## Properties

### limit?

```ts
optional limit?: number | null;
```

Return only the newest N entries, at least 1. Omit for the whole stack, which has no size cap and grows for as long as the project stays open.
