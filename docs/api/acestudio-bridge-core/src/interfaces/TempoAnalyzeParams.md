# Interface: TempoAnalyzeParams

Arguments for `tempo analyze`.

## Properties

### clipUuid?

```ts
optional clipUuid?: string;
```

The audio clip to analyze, by UUID (`clip list` reports it). An empty value is refused. Mutually exclusive with `filePath`: exactly one of the two is required.

***

### filePath?

```ts
optional filePath?: string;
```

Path of an audio file to analyze where it sits — it is not imported, and nothing in the project changes until `tempo apply-beat-analysis`. An empty value is refused. Mutually exclusive with `clipUuid`: exactly one of the two is required. A file-sourced analysis carries no anchor, so the apply needs one.
