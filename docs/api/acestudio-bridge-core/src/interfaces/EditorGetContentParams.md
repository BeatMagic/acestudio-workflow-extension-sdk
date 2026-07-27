# Interface: EditorGetContentParams

Arguments for `editor get-content`.

## Properties

### range?

```ts
optional range?: string | null;
```

Named range selector: `all` (default), `clip_region`, or `viewport`. Mutually exclusive with `--range-begin` / `--range-end`. `viewport` is only valid for note editors (Sing/Instrument/GenericMidi).

***

### rangeBegin?

```ts
optional rangeBegin?: number | null;
```

Custom range start (inclusive), editor-local. Ticks (`480t`) or a musical/clock position resolved into the clip frame (`4.1.0`, `1.5s`). Requires `--range-end`. Mutually exclusive with `--range`. See `help time-values`.

***

### rangeEnd?

```ts
optional rangeEnd?: number | null;
```

Custom range end (exclusive), editor-local. Same forms as `--range-begin`. Requires `--range-begin`; must be greater. See `help time-values`.
