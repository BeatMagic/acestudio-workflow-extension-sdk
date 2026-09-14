# Interface: PhonemeListParams

Arguments for `phoneme list`.

## Properties

### clipUuid?

```ts
optional clipUuid?: string;
```

UUID of the clip to report, in braces format. Required with a tick range, and ignored when `noteUuids` is given — the notes name their own clip. The clip must be a Sing clip; nothing else has a pronunciation.

***

### noteUuids?

```ts
optional noteUuids?: string[];
```

Notes to report, by UUID, from `clip note-content` or `phoneme list` itself. Every named note must exist, and all must live in one clip.

***

### onlyEdited?

```ts
optional onlyEdited?: boolean;
```

Report only the notes whose phonemes are an override. The question is about the symbols and nothing else. Phoneme timing does not enter it: synthesis writes timing data on its own, so a note carrying timing says only that it has been sung. `timingKinds` still reports what each selected note holds.

***

### rangeBegin?

```ts
optional rangeBegin?: number;
```

Start of the tick range to report. Give at least one of this and `rangeEnd` alongside `clipUuid`; the other defaults to the clip edge.

***

### rangeEnd?

```ts
optional rangeEnd?: number;
```

End of the tick range to report (exclusive).

***

### rangeScope?

```ts
optional rangeScope?: "project" | "clip-local";
```

Which coordinate system a tick range is given in. Declared as a roster rather than left a free string so every surface generated off this declaration — the SDK's types, MCP's input schema, a peer reading the contract — carries the two values a caller may send.

***

### withTimings?

```ts
optional withTimings?: "durations" | "boundaries" | "both";
```

Which shape the per-phoneme rows take. Bare `--with-timings` means `both`; the two narrower values exist for callers that want the lean row.
