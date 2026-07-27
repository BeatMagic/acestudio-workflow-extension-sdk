# Interface: EditorAddNotesResult

Success payload of `editor add-notes`.

## Properties

### lyricsApplied?

```ts
optional lyricsApplied?: string[];
```

Lyrics the G2P filler applied to the pasted notes, in selection order. Present only for Sing clips in sentence mode; all other successes return an empty object.
