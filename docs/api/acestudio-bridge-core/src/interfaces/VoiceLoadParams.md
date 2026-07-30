# Interface: VoiceLoadParams

Arguments for `voice load`.

## Properties

### group?

```ts
optional group?: string | null;
```

Which source it comes from: empty string for official, `#` for custom, `\@` for community, the account's blended-voice library id for a blend. Ids repeat across sources, so this is needed to disambiguate. Required for singer, choir, ensemble.

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
