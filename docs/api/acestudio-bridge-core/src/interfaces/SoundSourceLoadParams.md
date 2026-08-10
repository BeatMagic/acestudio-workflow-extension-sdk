# Interface: SoundSourceLoadParams

Arguments for `sound-source load`.

## Properties

### format?

```ts
optional format?: "vst3" | "vst2" | "au";
```

Which plugin format to mount for an external instrument. Defaults to `vst3`, and the format that was actually mounted is always reported. A format you asked for and the plugin does not offer is an error rather than a silent substitution.

***

### model?

```ts
optional model?: string | null;
```

Which vocal synth model to sing through, by model name or by generation (`v1`, `v2`). Omit to take what the app would have picked.

***

### source

```ts
source: string;
```

**Required.** Which sound source to load, by display name or by `ref`.

A name that matches exactly one source loads it. A name that matches several is an error listing the candidates with their refs, and passing one of those refs back resolves it. A ref is always accepted directly, so a script never has to trigger the error to learn the syntax.

***

### trackIndex?

```ts
optional trackIndex?: number | null;
```

0-based index in the arrangement.

***

### trackUuid?

```ts
optional trackUuid?: string | null;
```

Track UUID in braces format.

***

### vendor?

```ts
optional vendor?: string | null;
```

Narrow an ambiguous external-instrument name by plugin vendor. Two vendors shipping a plugin of the same name is ordinary; this is the first thing to reach for before falling back to a ref.
