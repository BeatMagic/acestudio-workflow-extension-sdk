# Variable: PROFILES

```ts
const PROFILES: {
  surface.cli-mcp: readonly ["caret.read", "caret.write", "chord.read", "chord.write", "clip.read", "clip.write", "device.read", "device.write", "editor.read", "editor.write", "export.invoke", "fx.read", "fx.write", "generative.add-layer", "generative.enhance", "generative.retake", "generative.seed-audio", "generative.song", "generative.sound-effects", "generative.stem-split", "generative.text2sample", "generative.vocal2midi", "generative.voice-change", "history.control", "history.read", "import.invoke", "job.control", "job.read", "lyric.read", "lyric.write", "note.read", "note.write", "project.lifecycle", "project.read", "recording.control", "selection.read", "selection.write", "soundsource.read", "soundsource.write", "tempo.analyze", "tempo.applyV2", "tempo.read", "tempo.write", "timesig.read", "timesig.write", "track.read", "track.write", "transport.control", "transport.state", "ui.control", "ui.state", "vocalparam.read", "vocalparam.write", "voice.read", "voice.write"];
  surface.extension-sdk: readonly ["session.handshake", "session.ping", "session.shutdown", "workflow.dev", "workflow.ui"];
};
```

Each published Surface Profile's transitive token expansion (ADR 0093 §6): the ceiling Studio grants a consumer class within, so a grant can be measured against it rather than token by token. The ceiling is met when every token here is granted. It is not a capability to request — it carries no version and it moves with the registry, and one the registry still marks draft may yet be re-cut.

## Type Declaration

#### surface.cli-mcp

```ts
readonly surface.cli-mcp: readonly ["caret.read", "caret.write", "chord.read", "chord.write", "clip.read", "clip.write", "device.read", "device.write", "editor.read", "editor.write", "export.invoke", "fx.read", "fx.write", "generative.add-layer", "generative.enhance", "generative.retake", "generative.seed-audio", "generative.song", "generative.sound-effects", "generative.stem-split", "generative.text2sample", "generative.vocal2midi", "generative.voice-change", "history.control", "history.read", "import.invoke", "job.control", "job.read", "lyric.read", "lyric.write", "note.read", "note.write", "project.lifecycle", "project.read", "recording.control", "selection.read", "selection.write", "soundsource.read", "soundsource.write", "tempo.analyze", "tempo.applyV2", "tempo.read", "tempo.write", "timesig.read", "timesig.write", "track.read", "track.write", "transport.control", "transport.state", "ui.control", "ui.state", "vocalparam.read", "vocalparam.write", "voice.read", "voice.write"];
```

#### surface.extension-sdk

```ts
readonly surface.extension-sdk: readonly ["session.handshake", "session.ping", "session.shutdown", "workflow.dev", "workflow.ui"];
```
