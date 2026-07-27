# Interface: ClipAudioContentResult

Success payload of `clip audio-content`.

## Properties

### audioFileName

```ts
audioFileName: string;
```

Project-relative path (starting with './') in full; absolute paths are truncated to the file name for privacy.

***

### loadingState

```ts
loadingState: string;
```

Audio load state: 'not_loaded', 'loaded_success', or 'loaded_failed'.
