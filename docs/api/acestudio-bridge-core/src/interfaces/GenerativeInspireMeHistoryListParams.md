# Interface: GenerativeInspireMeHistoryListParams

Arguments for `generative inspire-me history list`.

## Properties

### page?

```ts
optional page?: number;
```

1-based page. Default 1, the newest rows.

***

### pageSize?

```ts
optional pageSize?: number;
```

Rows per page, 1..50. Default 10, the panel's own page size.

***

### refresh?

```ts
optional refresh?: boolean;
```

Drop the cached window and re-read from the server. Off by default; pass it to see a generation that landed after the last read.
