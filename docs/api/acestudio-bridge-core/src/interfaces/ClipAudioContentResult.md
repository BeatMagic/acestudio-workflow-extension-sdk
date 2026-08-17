# Interface: ClipAudioContentResult

Success payload of `clip audio-content`.

## Properties

### audioFileName

```ts
audioFileName: string;
```

Project-relative path (starting with './') in full; absolute paths are truncated to the file name for privacy.

***

### fingerprint

```ts
fingerprint: Fingerprint;
```

Content fingerprint of the clip's source media (ADR 0088 §5): the path and its load state. No write on this surface replaces a clip's media, so this is a change-detection token rather than a precondition — re-read and compare to learn that the media was swapped or finished loading. Hashed over the full path even though `audioFileName` is redacted, so a swap between same-named files in different folders still shows up.

***

### loadingState

```ts
loadingState: string;
```

Audio load state: `not_loaded`, `loaded_success`, or `loaded_failed`.
