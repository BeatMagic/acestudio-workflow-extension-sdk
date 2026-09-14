# Interface: TempoApplyBeatAnalysisParams

Arguments for `tempo apply-beat-analysis`.

## Properties

### analysisId

```ts
analysisId: string;
```

The analysis to apply, as reported by `tempo analyze`. Spent on success: a second apply of the same id fails ALREADY_APPLIED, because the content shift the first one made invalidated what the analysis described. The id stays readable with `tempo get-analysis`, which reports it `applied`.

***

### anchor?

```ts
optional anchor?: number;
```

Where the analyzed audio starts, in project seconds. Omit to use the analyzed clip's position at the time it was analyzed, which is what you want unless the clip moved since. REQUIRED for an analysis of a loose file: a file has no position in the project, so there is no default to fall back to and omitting it is refused rather than placing the grid at the origin.
