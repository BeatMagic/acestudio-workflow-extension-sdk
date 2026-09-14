# Interface: NoteSetArticulationParams

Arguments for `note set-articulation`.

## Properties

### articulation

```ts
articulation: string;
```

The articulation to apply: the display name the app's Articulation menu shows ("Smart", "Legato", ...), matched case-insensitively. Which names are valid depends on the instruments loaded on the track — `editor status` reports the live list in `supportedArticulations`, and a rejection names it too. That list is the source of truth, so read it rather than hardcoding names (the server config can rename one). Internal keys are not accepted, and neither is an empty string.

***

### noteUuids

```ts
noteUuids: string[];
```

UUIDs of the target notes. All must be in the same Instrument clip.
