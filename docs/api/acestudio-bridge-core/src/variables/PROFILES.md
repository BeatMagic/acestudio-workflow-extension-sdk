# Variable: PROFILES

```ts
const PROFILES: {
  surface.cli-mcp.v1: readonly ["caret.read", "caret.write", "chord.read", "chord.write", "clip.read", "clip.write", "device.read", "device.write", "editor.read", "editor.write", "export.invoke", "fx.read", "fx.write", "generative.add-layer", "generative.enhance", "generative.retake", "generative.seed-audio", "generative.song", "generative.sound-effects", "generative.stem-split", "generative.text2sample", "generative.vocal2midi", "generative.voice-change", "history.control", "history.read", "import.invoke", "job.control", "job.read", "lyric.read", "lyric.write", "note.read", "note.write", "project.lifecycle", "project.read", "recording.control", "selection.read", "selection.write", "tempo.analyze", "tempo.applyV2", "tempo.read", "tempo.write", "timesig.read", "timesig.write", "track.read", "track.write", "transport.control", "transport.state", "ui.view", "vocalparam.read", "vocalparam.write", "voice.read", "voice.write"];
  surface.extension-sdk.v1: readonly ["session.handshake", "session.ping", "session.shutdown", "workflow.dev", "workflow.ui"];
};
```

Each published Capability Profile's transitive token expansion (ADR 0093 §1): a named bundle a grant is measured against, rather than a set the consumer hand-lists. A profile is met when every token here is granted. The expansion is the registry's and moves with it, and a profile the registry still marks draft may yet be re-cut (ADR 0093 §6).

## Type Declaration

#### surface.cli-mcp.v1

```ts
readonly surface.cli-mcp.v1: readonly ["caret.read", "caret.write", "chord.read", "chord.write", "clip.read", "clip.write", "device.read", "device.write", "editor.read", "editor.write", "export.invoke", "fx.read", "fx.write", "generative.add-layer", "generative.enhance", "generative.retake", "generative.seed-audio", "generative.song", "generative.sound-effects", "generative.stem-split", "generative.text2sample", "generative.vocal2midi", "generative.voice-change", "history.control", "history.read", "import.invoke", "job.control", "job.read", "lyric.read", "lyric.write", "note.read", "note.write", "project.lifecycle", "project.read", "recording.control", "selection.read", "selection.write", "tempo.analyze", "tempo.applyV2", "tempo.read", "tempo.write", "timesig.read", "timesig.write", "track.read", "track.write", "transport.control", "transport.state", "ui.view", "vocalparam.read", "vocalparam.write", "voice.read", "voice.write"];
```

#### surface.extension-sdk.v1

```ts
readonly surface.extension-sdk.v1: readonly ["session.handshake", "session.ping", "session.shutdown", "workflow.dev", "workflow.ui"];
```
