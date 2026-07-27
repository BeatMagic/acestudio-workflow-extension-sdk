# Interface: VoiceLoadParams

Arguments for `voice load`.

## Properties

### group?

```ts
optional group?: string | null;
```

Group identifier. Empty string for official sources, `#` for custom, any other value for community. Required for singer, choir, ensemble.

***

### id

```ts
id: number;
```

Sound source ID.

***

### routerId?

```ts
optional routerId?: number | null;
```

Router ID for singers. Omit to use the source's default router.

***

### soundSourceType

```ts
soundSourceType: string;
```

Kind of voice to load: `singer`, `choir`, `instrument`, or `ensemble`.

***

### trackIndex

```ts
trackIndex: number;
```

0-based track index (users see tracks starting from 1).
