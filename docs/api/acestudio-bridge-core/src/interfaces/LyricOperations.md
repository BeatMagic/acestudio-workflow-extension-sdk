# Interface: LyricOperations

The `lyric` operations, mirroring the canonical operation tree 1:1.

## Methods

### fill()

```ts
fill(params, options?): Promise<LyricFillResult>;
```

Fill a run of notes with lyric text, the way the app's own affordances do.

Requires the `lyric.write` capability.

#### Parameters

##### params

[`LyricFillParams`](LyricFillParams.md)

##### options?

[`PreconditionCallOptions`](PreconditionCallOptions.md)

#### Returns

`Promise`\<[`LyricFillResult`](LyricFillResult.md)\>
