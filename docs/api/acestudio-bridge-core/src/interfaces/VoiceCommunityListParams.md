# Interface: VoiceCommunityListParams

Arguments for `voice community-list`.

## Properties

### isMyCollection?

```ts
optional isMyCollection?: boolean | null;
```

If set, only return voices already in your collection.

***

### keyword?

```ts
optional keyword?: string | null;
```

Filter by name substring (case-insensitive).

***

### language?

```ts
optional language?: string | null;
```

Filter by language (natural language name, e.g. `Chinese`).

***

### page

```ts
page: number;
```

Page number (0-based). Each page contains up to 30 voices.

***

### tags?

```ts
optional tags?: string[] | null;
```

Filter by tag names (case-insensitive, OR logic).
