# Variable: CAPABILITY\_TOKENS

```ts
const CAPABILITY_TOKENS: readonly ["audioplugin.control", "audioplugin.read", "audioplugin.write", "canvas.read", "caret.read", "caret.write", "chord.read", "chord.write", "clip.read", "clip.write", "device.read", "device.write", "editor.read", "editor.write", "export.invoke", "generative-history.read", "generative.add-a-layer", "generative.inspire-me", "generative.music-enhancer", "generative.stem-splitter", "generative.vocal-to-midi", "generative.voice-changer", "history.control", "history.read", "import.invoke", "job.control", "job.read", "lyric.read", "lyric.write", "midiparam.read", "midiparam.write", "note.read", "note.write", "project.lifecycle", "project.read", "recording.control", "selection.read", "selection.write", "session.handshake", "session.move", "session.ping", "session.shutdown", "soundsource.read", "soundsource.write", "tempo.analyze", "tempo.applyV2", "tempo.read", "tempo.write", "timesig.read", "timesig.write", "track.audition", "track.read", "track.write", "transport.control", "transport.state", "ui.control", "ui.state", "vocalparam.read", "vocalparam.write", "voice.read", "voice.write", "workflow.dev", "workflow.ui"];
```

Every token in the union above, as a value: what the handshake's granted names are matched against to tell a token this artifact cannot name from one it does not recognise at all.
