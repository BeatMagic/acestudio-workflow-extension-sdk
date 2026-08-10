# Interface: TempoApplyBeatAnalysisParams

Arguments for `tempo apply-beat-analysis`.

## Properties

### analysisId

```ts
analysisId: string;
```

The analysis to apply, as reported by `tempo analyze`. Consumed on success: a second apply of the same id fails NOT_FOUND, because the content shift the first one made invalidated what the analysis described.

***

### anchor?

```ts
optional anchor?: number | null;
```

Where the analyzed audio starts, in project time. Omit to use the analyzed clip's own current position, which is what you want unless the clip moved since. Seconds (`1.5s`), clock time (`1:23.5`), or a tick / musical position converted to seconds. See `help time-values`.
