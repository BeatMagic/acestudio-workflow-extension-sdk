# Interface: VoiceListParams

Arguments for `voice list`.

## Properties

### category?

```ts
optional category?: string | null;
```

Filter instruments by category name (e.g. `Piano`). Ignored for voices, choirs, and ensembles.

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

Filter voices by language (natural language name, e.g. `Chinese`). Ignored for instruments and ensembles.

***

### tags?

```ts
optional tags?: string[] | null;
```

Filter by tag names (case-insensitive, OR logic). Example: `--tags Pop --tags Female`.

***

### type

```ts
type: string;
```

Type of sound source to query. One of: `voice`, `choir`, `instrument`, `ensemble`.
