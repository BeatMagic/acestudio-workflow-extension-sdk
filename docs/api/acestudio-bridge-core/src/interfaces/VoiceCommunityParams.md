# Interface: VoiceCommunityParams

Arguments for `voice community`.

## Properties

### isMyCollection?

```ts
optional isMyCollection?: boolean;
```

Only return voices you have already collected.

***

### keyword?

```ts
optional keyword?: string;
```

Filter by name substring, case-insensitive.

***

### language?

```ts
optional language?: string;
```

Filter by *native* language, as a full English name such as `Japanese` -- the language a voice was mainly trained on, and so the one it sings most like a native speaker of. Not what it can sing: cross-language singing is a property of the vocal synth model, so the supported list would match nearly everything.

***

### page?

```ts
optional page?: number;
```

Which page to fetch, 0-based. Each page holds up to 30 voices. Defaults to the first page.

***

### tags?

```ts
optional tags?: string[];
```

Filter by tag name, case-insensitive, matching any of the given tags.
