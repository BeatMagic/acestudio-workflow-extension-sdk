# Variable: CAPABILITY\_TOKENS

```ts
const CAPABILITY_TOKENS: readonly ["caret.read", "caret.write", "chord.read", "chord.write", "clip.read", "clip.write", "device.read", "device.write", "editor.read", "editor.write", "export.invoke", "fx.read", "fx.write", "generative.add-layer", "generative.enhance", "generative.retake", "generative.seed-audio", "generative.song", "generative.sound-effects", "generative.stem-split", "generative.text2sample", "generative.vocal2midi", "generative.voice-change", "history.control", "history.read", "import.invoke", "job.control", "job.read", "lyric.read", "lyric.write", "note.read", "note.write", "project.lifecycle", "project.read", "recording.control", "selection.read", "selection.write", "session.handshake", "session.ping", "session.shutdown", "tempo.analyze", "tempo.applyV2", "tempo.read", "tempo.write", "timesig.read", "timesig.write", "track.read", "track.write", "transport.control", "transport.state", "ui.control", "ui.state", "vocalparam.read", "vocalparam.write", "voice.read", "voice.write", "workflow.dev", "workflow.ui"];
```

Every token in the union above, as a value: what the handshake's granted names are matched against to tell a token this artifact cannot name from one it does not recognise at all.
