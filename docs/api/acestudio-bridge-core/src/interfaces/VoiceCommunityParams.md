# Interface: VoiceCommunityParams

Arguments for `voice community`.

## Properties

### isMyCollection?

```ts
optional isMyCollection?: boolean | null;
```

Only return voices you have already collected.

***

### keyword?

```ts
optional keyword?: string | null;
```

Filter by name substring, case-insensitive.

***

### language?

```ts
optional language?: string | null;
```

Filter by language, as a full English name such as `Japanese`.

***

### page?

```ts
optional page?: number | null;
```

Which page to fetch, 0-based. Each page holds up to 30 voices. Defaults to the first page.

***

### tags?

```ts
optional tags?: string[] | null;
```

Filter by tag name, case-insensitive, matching any of the given tags.
