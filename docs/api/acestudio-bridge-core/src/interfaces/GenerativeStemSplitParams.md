# Interface: GenerativeStemSplitParams

Arguments for `generative stem-split`.

## Properties

### clipUuid

```ts
clipUuid: string;
```

The audio clip to split, by id. Its stem tracks are inserted below its source track, the way the panel inserts them.

One clip per launch, because one launch returns one job id and the producer opens a job **per clip** (`AiPluginTaskStemSplitterScheduler` schedules an attempt each). Splitting several clips is several launches -- which also lets each one be waited on and cancelled independently.

***

### mode?

```ts
optional mode?: "basic" | "professional" | "advanced" | "customized";
```

Which stems to produce: `basic` (default), `professional`, `advanced` or `customized`. The first two are free; the last two bill different SKUs, so this is never inferred.

***

### prompt?

```ts
optional prompt?: string | null;
```

Which sound to isolate, in words ("just the horns"). **`--mode customized` only**, and required there -- that mode has no fixed stem set, so without a prompt there is nothing to separate.

***

### removeReverb?

```ts
optional removeReverb?: boolean | null;
```

Strip reverb from the separated vocal. Off by default.

**`basic` and `professional` only.** The two fine-grained modes do not support it (`StemSplitterModeNS::isRemoveReverbSupported`), so passing it there is an error rather than a flag that is quietly dropped.
