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
optional anchor?: number;
```

Where the analyzed audio starts, in project seconds. Omit to use the analyzed clip's own current position, which is what you want unless the clip moved since.
