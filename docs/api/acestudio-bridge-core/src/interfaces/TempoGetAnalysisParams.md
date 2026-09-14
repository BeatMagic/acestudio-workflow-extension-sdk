# Interface: TempoGetAnalysisParams

Arguments for `tempo get-analysis`.

## Properties

### analysisId

```ts
analysisId: string;
```

The analysis to read, as reported by `tempo analyze`. Reading never consumes it: the same id answers as many times as it is asked, before and after `tempo apply-beat-analysis`.
