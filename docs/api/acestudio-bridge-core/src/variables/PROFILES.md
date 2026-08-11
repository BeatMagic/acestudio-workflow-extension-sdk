# Variable: PROFILES

```ts
const PROFILES: {
  generative.all.v1: readonly ["generative.add-layer", "generative.enhance", "generative.retake", "generative.seed-audio", "generative.song", "generative.sound-effects", "generative.stem-split", "generative.text2sample", "generative.vocal2midi", "generative.voice-change"];
  project.v1: readonly ["project.read"];
  surface.cli-mcp: readonly ["caret.read", "caret.write", "chord.read", "chord.write", "clip.read", "clip.write", "device.read", "device.write", "editor.read", "editor.write", "export.invoke", "fx.read", "fx.write", "generative.add-layer", "generative.enhance", "generative.retake", "generative.seed-audio", "generative.song", "generative.sound-effects", "generative.stem-split", "generative.text2sample", "generative.vocal2midi", "generative.voice-change", "history.control", "history.read", "import.invoke", "job.control", "job.read", "lyric.read", "lyric.write", "note.read", "note.write", "project.lifecycle", "project.read", "recording.control", "selection.read", "selection.write", "soundsource.read", "soundsource.write", "tempo.analyze", "tempo.applyV2", "tempo.read", "tempo.write", "timesig.read", "timesig.write", "track.read", "track.write", "transport.control", "transport.state", "ui.control", "ui.state", "vocalparam.read", "vocalparam.write", "voice.read", "voice.write"];
  surface.extension-sdk: readonly ["session.handshake", "session.ping", "session.shutdown", "workflow.dev", "workflow.ui"];
  ui.v1: readonly ["workflow.ui"];
};
```

Each profile's transitive token expansion: a name for a bundle of capability tokens, so a grant can be measured against one name rather than token by token. A profile is met when every token here is granted. The capabilities are the contract — a profile is a convenience over them and grants nothing itself. Surface ceilings (ADR 0093 §6) sit here beside the versioned bundles (ADR 0022): a ceiling carries no version, moves with the Studio build enforcing it, and is not a capability to request.

## Type Declaration

#### generative.all.v1

```ts
readonly generative.all.v1: readonly ["generative.add-layer", "generative.enhance", "generative.retake", "generative.seed-audio", "generative.song", "generative.sound-effects", "generative.stem-split", "generative.text2sample", "generative.vocal2midi", "generative.voice-change"];
```

#### project.v1

```ts
readonly project.v1: readonly ["project.read"];
```

#### surface.cli-mcp

```ts
readonly surface.cli-mcp: readonly ["caret.read", "caret.write", "chord.read", "chord.write", "clip.read", "clip.write", "device.read", "device.write", "editor.read", "editor.write", "export.invoke", "fx.read", "fx.write", "generative.add-layer", "generative.enhance", "generative.retake", "generative.seed-audio", "generative.song", "generative.sound-effects", "generative.stem-split", "generative.text2sample", "generative.vocal2midi", "generative.voice-change", "history.control", "history.read", "import.invoke", "job.control", "job.read", "lyric.read", "lyric.write", "note.read", "note.write", "project.lifecycle", "project.read", "recording.control", "selection.read", "selection.write", "soundsource.read", "soundsource.write", "tempo.analyze", "tempo.applyV2", "tempo.read", "tempo.write", "timesig.read", "timesig.write", "track.read", "track.write", "transport.control", "transport.state", "ui.control", "ui.state", "vocalparam.read", "vocalparam.write", "voice.read", "voice.write"];
```

#### surface.extension-sdk

```ts
readonly surface.extension-sdk: readonly ["session.handshake", "session.ping", "session.shutdown", "workflow.dev", "workflow.ui"];
```

#### ui.v1

```ts
readonly ui.v1: readonly ["workflow.ui"];
```
