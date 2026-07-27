# Interface: VoiceCommunityPagesParams

Arguments for `voice community-pages`.

## Properties

### isMyCollection?

```ts
optional isMyCollection?: boolean | null;
```

If set, count only voices in your collection.

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

### tags?

```ts
optional tags?: string[] | null;
```

Filter by tag names (case-insensitive, OR logic).
