# Variable: PROFILES

```ts
const PROFILES: {
  generative.all.v1: readonly ["generative.add-a-layer", "generative.inspire-me", "generative.music-enhancer", "generative.stem-splitter", "generative.vocal-to-midi", "generative.voice-changer"];
  surface.cli-mcp: readonly ["audioplugin.control", "audioplugin.read", "audioplugin.write", "canvas.read", "caret.read", "caret.write", "chord.read", "chord.write", "clip.read", "clip.write", "device.read", "device.write", "editor.read", "editor.write", "export.invoke", "generative-history.read", "generative.add-a-layer", "generative.inspire-me", "generative.music-enhancer", "generative.stem-splitter", "generative.vocal-to-midi", "generative.voice-changer", "history.control", "history.read", "import.invoke", "job.control", "job.read", "lyric.read", "lyric.write", "midiparam.read", "midiparam.write", "note.read", "note.write", "project.lifecycle", "project.read", "recording.control", "selection.read", "selection.write", "soundsource.read", "soundsource.write", "tempo.analyze", "tempo.applyV2", "tempo.read", "tempo.write", "timesig.read", "timesig.write", "track.audition", "track.read", "track.write", "transport.control", "transport.state", "ui.control", "ui.state", "vocalparam.read", "vocalparam.write", "voice.read", "voice.write"];
  surface.extension-sdk: readonly ["canvas.read", "session.handshake", "session.move", "session.ping", "session.shutdown", "workflow.dev", "workflow.ui"];
  timeline.tempo.v1: readonly ["tempo.analyze", "tempo.applyV2", "tempo.read", "tempo.write"];
  transport.v1: readonly ["transport.control"];
  ui.v1: readonly ["workflow.ui"];
};
```

Each profile's transitive token expansion: a name for a bundle of capability tokens, so a grant can be measured against one name rather than token by token. A profile is met when every token here is granted. The capabilities are the contract — a profile is a convenience over them and grants nothing itself. Surface ceilings (ADR 0093 §6) sit here beside the versioned bundles (ADR 0022): a ceiling carries no version, moves with the Studio build enforcing it, and is not a capability to request.

## Type Declaration

#### generative.all.v1

```ts
readonly generative.all.v1: readonly ["generative.add-a-layer", "generative.inspire-me", "generative.music-enhancer", "generative.stem-splitter", "generative.vocal-to-midi", "generative.voice-changer"];
```

#### surface.cli-mcp

```ts
readonly surface.cli-mcp: readonly ["audioplugin.control", "audioplugin.read", "audioplugin.write", "canvas.read", "caret.read", "caret.write", "chord.read", "chord.write", "clip.read", "clip.write", "device.read", "device.write", "editor.read", "editor.write", "export.invoke", "generative-history.read", "generative.add-a-layer", "generative.inspire-me", "generative.music-enhancer", "generative.stem-splitter", "generative.vocal-to-midi", "generative.voice-changer", "history.control", "history.read", "import.invoke", "job.control", "job.read", "lyric.read", "lyric.write", "midiparam.read", "midiparam.write", "note.read", "note.write", "project.lifecycle", "project.read", "recording.control", "selection.read", "selection.write", "soundsource.read", "soundsource.write", "tempo.analyze", "tempo.applyV2", "tempo.read", "tempo.write", "timesig.read", "timesig.write", "track.audition", "track.read", "track.write", "transport.control", "transport.state", "ui.control", "ui.state", "vocalparam.read", "vocalparam.write", "voice.read", "voice.write"];
```

#### surface.extension-sdk

```ts
readonly surface.extension-sdk: readonly ["canvas.read", "session.handshake", "session.move", "session.ping", "session.shutdown", "workflow.dev", "workflow.ui"];
```

#### timeline.tempo.v1

```ts
readonly timeline.tempo.v1: readonly ["tempo.analyze", "tempo.applyV2", "tempo.read", "tempo.write"];
```

#### transport.v1

```ts
readonly transport.v1: readonly ["transport.control"];
```

#### ui.v1

```ts
readonly ui.v1: readonly ["workflow.ui"];
```
