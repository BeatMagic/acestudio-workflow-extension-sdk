# Variable: REQUIRED\_TOKENS

```ts
const REQUIRED_TOKENS: {
  audio-plugin apply-preset: "audioplugin.write";
  audio-plugin editor capture: "audioplugin.read";
  audio-plugin editor click: "audioplugin.control";
  audio-plugin editor close: "ui.control";
  audio-plugin editor dblclick: "audioplugin.control";
  audio-plugin editor drag: "audioplugin.control";
  audio-plugin editor hover: "audioplugin.control";
  audio-plugin editor info: "audioplugin.read";
  audio-plugin editor key: "audioplugin.control";
  audio-plugin editor open: "ui.control";
  audio-plugin editor resize: "audioplugin.control";
  audio-plugin editor type: "audioplugin.control";
  audio-plugin editor wheel: "audioplugin.control";
  audio-plugin export-preset: "audioplugin.read";
  audio-plugin find-presets: "audioplugin.read";
  audio-plugin get-params: "audioplugin.read";
  audio-plugin get-state: "audioplugin.read";
  audio-plugin import-preset: "audioplugin.write";
  audio-plugin list-available: "audioplugin.read";
  audio-plugin list-params: "audioplugin.read";
  audio-plugin list-presets: "audioplugin.read";
  audio-plugin move-preset: "audioplugin.write";
  audio-plugin remove-preset: "audioplugin.write";
  audio-plugin save-preset: "audioplugin.write";
  audio-plugin scan: "audioplugin.write";
  audio-plugin set: "audioplugin.write";
  audio-plugin set-param: "audioplugin.write";
  audio-plugin set-state: "audioplugin.write";
  audio-plugin slots: "audioplugin.read";
  blend add: "voice.write";
  blend create: "voice.write";
  blend delete: "voice.write";
  blend get: "voice.read";
  blend list: "voice.read";
  blend promote: "voice.write";
  blend remove: "voice.write";
  blend reorder: "voice.write";
  blend set: "voice.write";
  breath list: "vocalparam.read";
  breath remove: "vocalparam.write";
  breath set: "vocalparam.write";
  canvas effective-size: "canvas.read";
  canvas info: "canvas.read";
  caret get: "caret.read";
  caret set: "caret.write";
  choir add: "soundsource.write";
  choir disable: "soundsource.write";
  choir enable: "soundsource.write";
  choir get: "soundsource.read";
  choir remove: "soundsource.write";
  choir reorder: "soundsource.write";
  choir set: "soundsource.write";
  chord delete: "chord.write";
  chord insert: "chord.write";
  chord list: "chord.read";
  chord set: "chord.write";
  clip audio-content: "clip.read";
  clip beat-content: "clip.read";
  clip consolidate: "clip.write";
  clip create: "clip.write";
  clip delete: "clip.write";
  clip detach-audio: "clip.write";
  clip duplicate: "clip.write";
  clip get: "clip.read";
  clip list: "clip.read";
  clip lyrics: "clip.read";
  clip move: "clip.write";
  clip note-content: "clip.read";
  clip reattach-audio: "clip.write";
  clip replace-content: "clip.write";
  clip resize: "clip.write";
  clip set: "clip.write";
  clip set-enabled: "clip.write";
  clip set-fades: "clip.write";
  clip set-gain: "clip.write";
  clip set-muted: "clip.write";
  clip split: "clip.write";
  device current: "device.read";
  device list: "device.read";
  device set-audio: "device.write";
  editor current-clip: "editor.read";
  editor open: "editor.write";
  editor status: "editor.read";
  editor tick-range: "editor.read";
  ensemble add: "soundsource.write";
  ensemble disable: "soundsource.write";
  ensemble enable: "soundsource.write";
  ensemble get: "soundsource.read";
  ensemble remove: "soundsource.write";
  ensemble reorder: "soundsource.write";
  ensemble set: "soundsource.write";
  export audio: "export.invoke";
  export lrc: "export.invoke";
  export midi: "export.invoke";
  export song-template: "export.invoke";
  export timeline: "export.invoke";
  export video: "export.invoke";
  export vocal-sample: "export.invoke";
  fx add: "audioplugin.write";
  fx apply-chain: "audioplugin.write";
  fx export-chain: "audioplugin.read";
  fx find-chains: "audioplugin.read";
  fx import-chain: "audioplugin.write";
  fx insert-chain: "audioplugin.write";
  fx list-chains: "audioplugin.read";
  fx move-chain: "audioplugin.write";
  fx remove: "audioplugin.write";
  fx remove-chain: "audioplugin.write";
  fx reorder: "audioplugin.write";
  fx save-chain: "audioplugin.write";
  fx set-room: "audioplugin.write";
  generative add-a-layer: "generative.add-a-layer";
  generative inspire-me: "generative.inspire-me";
  generative inspire-me history get: "generative-history.read";
  generative inspire-me history list: "generative-history.read";
  generative music-enhancer: "generative.music-enhancer";
  generative music-enhancer history get: "generative-history.read";
  generative music-enhancer history list: "generative-history.read";
  generative stem-splitter: "generative.stem-splitter";
  generative vocal-to-midi: "generative.vocal-to-midi";
  generative voice-changer convert: "generative.voice-changer";
  generative voice-changer models: "generative.voice-changer";
  history list: "history.read";
  history redo: "history.control";
  history undo: "history.control";
  import file: "import.invoke";
  instrument set: "soundsource.write";
  job cancel: "job.control";
  job discard-result: "job.control";
  job download: "job.control";
  job get: "job.read";
  job list: "job.read";
  job place: "clip.write";
  job results: "job.read";
  job wait: "job.read";
  lyric fill: "lyric.write";
  midiparam clear: "midiparam.write";
  midiparam list-lanes: "midiparam.read";
  midiparam read: "midiparam.read";
  midiparam remove-point: "midiparam.write";
  midiparam set-point: "midiparam.write";
  midiparam set-velocity: "midiparam.write";
  midiparam velocity: "midiparam.read";
  midiparam write: "midiparam.write";
  note add: "note.write";
  note delete: "note.write";
  note get: "note.read";
  note move: "note.write";
  note resize: "note.write";
  note set-articulation: "note.write";
  note set-grapheme: "note.write";
  note set-language: "note.write";
  note split: "note.write";
  phoneme g2p: "lyric.read";
  phoneme inventory: "lyric.read";
  phoneme list: "lyric.read";
  phoneme move-boundary: "lyric.write";
  phoneme reset: "lyric.write";
  phoneme reset-override: "lyric.write";
  phoneme reset-timing: "lyric.write";
  phoneme set: "lyric.write";
  phoneme set-consonant-timing: "lyric.write";
  project collect-save: "project.lifecycle";
  project dirty: "project.read";
  project info: "project.read";
  project new: "project.lifecycle";
  project open: "project.lifecycle";
  project recent: "project.read";
  project recent-clear: "project.lifecycle";
  project save: "project.lifecycle";
  project save-as: "project.lifecycle";
  project synthesis-status: "project.read";
  recording start: "recording.control";
  recording stop: "recording.control";
  selection get: "selection.read";
  selection set: "selection.write";
  sound-source get: "soundsource.read";
  sound-source list: "soundsource.read";
  sound-source load: "soundsource.write";
  sound-source set: "soundsource.write";
  sound-source tags: "soundsource.read";
  sound-source unload: "soundsource.write";
  tempo analyze: "tempo.analyze";
  tempo apply-beat-analysis: "tempo.applyV2";
  tempo get: "tempo.read";
  tempo get-analysis: "tempo.read";
  tempo points: "tempo.read";
  tempo remove-point: "tempo.write";
  tempo set: "tempo.write";
  tempo set-display-range: "tempo.write";
  tempo set-point: "tempo.write";
  timesig get: "timesig.read";
  timesig list: "timesig.read";
  timesig remove-at: "timesig.write";
  timesig set: "timesig.write";
  timesig set-at: "timesig.write";
  track audition note: "track.audition";
  track audition note-clear: "track.audition";
  track audition note-off: "track.audition";
  track audition note-on: "track.audition";
  track create: "track.write";
  track delete: "track.write";
  track duplicate: "track.write";
  track get: "track.read";
  track list: "track.read";
  track rename: "track.write";
  track reorder: "track.write";
  track resolve: "track.read";
  track set: "track.write";
  track set-input: "track.write";
  track set-language: "track.write";
  transport loop: "transport.state";
  transport metronome: "transport.control";
  transport play: "transport.control";
  transport seek: "transport.control";
  transport set-loop: "transport.control";
  transport state: "transport.state";
  transport stop: "transport.control";
  transport toggle: "transport.control";
  ui get: "ui.state";
  ui hide-panel: "ui.control";
  ui hide-special-track: "ui.control";
  ui hide-window: "ui.control";
  ui show-panel: "ui.control";
  ui show-special-track: "ui.control";
  ui show-window: "ui.control";
  vocalparam layers: "vocalparam.read";
  vocalparam read: "vocalparam.read";
  vocalparam set-voicing: "vocalparam.write";
  vocalparam voicing: "vocalparam.read";
  vocalparam write: "vocalparam.write";
  voice collect: "voice.write";
  voice community: "voice.read";
  voice seeds: "voice.read";
  voice synth-models: "voice.read";
};
```

The token each operation requires, for the pre-wire guard: a call the session's grant cannot reach fails locally with the identical typed `CAPABILITY_DENIED` the host would have returned. Ungated operations are absent — they need no token.

## Type Declaration

### audio-plugin apply-preset

```ts
readonly audio-plugin apply-preset: "audioplugin.write" = 'audioplugin.write';
```

### audio-plugin editor capture

```ts
readonly audio-plugin editor capture: "audioplugin.read" = 'audioplugin.read';
```

### audio-plugin editor click

```ts
readonly audio-plugin editor click: "audioplugin.control" = 'audioplugin.control';
```

### audio-plugin editor close

```ts
readonly audio-plugin editor close: "ui.control" = 'ui.control';
```

### audio-plugin editor dblclick

```ts
readonly audio-plugin editor dblclick: "audioplugin.control" = 'audioplugin.control';
```

### audio-plugin editor drag

```ts
readonly audio-plugin editor drag: "audioplugin.control" = 'audioplugin.control';
```

### audio-plugin editor hover

```ts
readonly audio-plugin editor hover: "audioplugin.control" = 'audioplugin.control';
```

### audio-plugin editor info

```ts
readonly audio-plugin editor info: "audioplugin.read" = 'audioplugin.read';
```

### audio-plugin editor key

```ts
readonly audio-plugin editor key: "audioplugin.control" = 'audioplugin.control';
```

### audio-plugin editor open

```ts
readonly audio-plugin editor open: "ui.control" = 'ui.control';
```

### audio-plugin editor resize

```ts
readonly audio-plugin editor resize: "audioplugin.control" = 'audioplugin.control';
```

### audio-plugin editor type

```ts
readonly audio-plugin editor type: "audioplugin.control" = 'audioplugin.control';
```

### audio-plugin editor wheel

```ts
readonly audio-plugin editor wheel: "audioplugin.control" = 'audioplugin.control';
```

### audio-plugin export-preset

```ts
readonly audio-plugin export-preset: "audioplugin.read" = 'audioplugin.read';
```

### audio-plugin find-presets

```ts
readonly audio-plugin find-presets: "audioplugin.read" = 'audioplugin.read';
```

### audio-plugin get-params

```ts
readonly audio-plugin get-params: "audioplugin.read" = 'audioplugin.read';
```

### audio-plugin get-state

```ts
readonly audio-plugin get-state: "audioplugin.read" = 'audioplugin.read';
```

### audio-plugin import-preset

```ts
readonly audio-plugin import-preset: "audioplugin.write" = 'audioplugin.write';
```

### audio-plugin list-available

```ts
readonly audio-plugin list-available: "audioplugin.read" = 'audioplugin.read';
```

### audio-plugin list-params

```ts
readonly audio-plugin list-params: "audioplugin.read" = 'audioplugin.read';
```

### audio-plugin list-presets

```ts
readonly audio-plugin list-presets: "audioplugin.read" = 'audioplugin.read';
```

### audio-plugin move-preset

```ts
readonly audio-plugin move-preset: "audioplugin.write" = 'audioplugin.write';
```

### audio-plugin remove-preset

```ts
readonly audio-plugin remove-preset: "audioplugin.write" = 'audioplugin.write';
```

### audio-plugin save-preset

```ts
readonly audio-plugin save-preset: "audioplugin.write" = 'audioplugin.write';
```

### audio-plugin scan

```ts
readonly audio-plugin scan: "audioplugin.write" = 'audioplugin.write';
```

### audio-plugin set

```ts
readonly audio-plugin set: "audioplugin.write" = 'audioplugin.write';
```

### audio-plugin set-param

```ts
readonly audio-plugin set-param: "audioplugin.write" = 'audioplugin.write';
```

### audio-plugin set-state

```ts
readonly audio-plugin set-state: "audioplugin.write" = 'audioplugin.write';
```

### audio-plugin slots

```ts
readonly audio-plugin slots: "audioplugin.read" = 'audioplugin.read';
```

### blend add

```ts
readonly blend add: "voice.write" = 'voice.write';
```

### blend create

```ts
readonly blend create: "voice.write" = 'voice.write';
```

### blend delete

```ts
readonly blend delete: "voice.write" = 'voice.write';
```

### blend get

```ts
readonly blend get: "voice.read" = 'voice.read';
```

### blend list

```ts
readonly blend list: "voice.read" = 'voice.read';
```

### blend promote

```ts
readonly blend promote: "voice.write" = 'voice.write';
```

### blend remove

```ts
readonly blend remove: "voice.write" = 'voice.write';
```

### blend reorder

```ts
readonly blend reorder: "voice.write" = 'voice.write';
```

### blend set

```ts
readonly blend set: "voice.write" = 'voice.write';
```

### breath list

```ts
readonly breath list: "vocalparam.read" = 'vocalparam.read';
```

### breath remove

```ts
readonly breath remove: "vocalparam.write" = 'vocalparam.write';
```

### breath set

```ts
readonly breath set: "vocalparam.write" = 'vocalparam.write';
```

### canvas effective-size

```ts
readonly canvas effective-size: "canvas.read" = 'canvas.read';
```

### canvas info

```ts
readonly canvas info: "canvas.read" = 'canvas.read';
```

### caret get

```ts
readonly caret get: "caret.read" = 'caret.read';
```

### caret set

```ts
readonly caret set: "caret.write" = 'caret.write';
```

### choir add

```ts
readonly choir add: "soundsource.write" = 'soundsource.write';
```

### choir disable

```ts
readonly choir disable: "soundsource.write" = 'soundsource.write';
```

### choir enable

```ts
readonly choir enable: "soundsource.write" = 'soundsource.write';
```

### choir get

```ts
readonly choir get: "soundsource.read" = 'soundsource.read';
```

### choir remove

```ts
readonly choir remove: "soundsource.write" = 'soundsource.write';
```

### choir reorder

```ts
readonly choir reorder: "soundsource.write" = 'soundsource.write';
```

### choir set

```ts
readonly choir set: "soundsource.write" = 'soundsource.write';
```

### chord delete

```ts
readonly chord delete: "chord.write" = 'chord.write';
```

### chord insert

```ts
readonly chord insert: "chord.write" = 'chord.write';
```

### chord list

```ts
readonly chord list: "chord.read" = 'chord.read';
```

### chord set

```ts
readonly chord set: "chord.write" = 'chord.write';
```

### clip audio-content

```ts
readonly clip audio-content: "clip.read" = 'clip.read';
```

### clip beat-content

```ts
readonly clip beat-content: "clip.read" = 'clip.read';
```

### clip consolidate

```ts
readonly clip consolidate: "clip.write" = 'clip.write';
```

### clip create

```ts
readonly clip create: "clip.write" = 'clip.write';
```

### clip delete

```ts
readonly clip delete: "clip.write" = 'clip.write';
```

### clip detach-audio

```ts
readonly clip detach-audio: "clip.write" = 'clip.write';
```

### clip duplicate

```ts
readonly clip duplicate: "clip.write" = 'clip.write';
```

### clip get

```ts
readonly clip get: "clip.read" = 'clip.read';
```

### clip list

```ts
readonly clip list: "clip.read" = 'clip.read';
```

### clip lyrics

```ts
readonly clip lyrics: "clip.read" = 'clip.read';
```

### clip move

```ts
readonly clip move: "clip.write" = 'clip.write';
```

### clip note-content

```ts
readonly clip note-content: "clip.read" = 'clip.read';
```

### clip reattach-audio

```ts
readonly clip reattach-audio: "clip.write" = 'clip.write';
```

### clip replace-content

```ts
readonly clip replace-content: "clip.write" = 'clip.write';
```

### clip resize

```ts
readonly clip resize: "clip.write" = 'clip.write';
```

### clip set

```ts
readonly clip set: "clip.write" = 'clip.write';
```

### clip set-enabled

```ts
readonly clip set-enabled: "clip.write" = 'clip.write';
```

### clip set-fades

```ts
readonly clip set-fades: "clip.write" = 'clip.write';
```

### clip set-gain

```ts
readonly clip set-gain: "clip.write" = 'clip.write';
```

### clip set-muted

```ts
readonly clip set-muted: "clip.write" = 'clip.write';
```

### clip split

```ts
readonly clip split: "clip.write" = 'clip.write';
```

### device current

```ts
readonly device current: "device.read" = 'device.read';
```

### device list

```ts
readonly device list: "device.read" = 'device.read';
```

### device set-audio

```ts
readonly device set-audio: "device.write" = 'device.write';
```

### editor current-clip

```ts
readonly editor current-clip: "editor.read" = 'editor.read';
```

### editor open

```ts
readonly editor open: "editor.write" = 'editor.write';
```

### editor status

```ts
readonly editor status: "editor.read" = 'editor.read';
```

### editor tick-range

```ts
readonly editor tick-range: "editor.read" = 'editor.read';
```

### ensemble add

```ts
readonly ensemble add: "soundsource.write" = 'soundsource.write';
```

### ensemble disable

```ts
readonly ensemble disable: "soundsource.write" = 'soundsource.write';
```

### ensemble enable

```ts
readonly ensemble enable: "soundsource.write" = 'soundsource.write';
```

### ensemble get

```ts
readonly ensemble get: "soundsource.read" = 'soundsource.read';
```

### ensemble remove

```ts
readonly ensemble remove: "soundsource.write" = 'soundsource.write';
```

### ensemble reorder

```ts
readonly ensemble reorder: "soundsource.write" = 'soundsource.write';
```

### ensemble set

```ts
readonly ensemble set: "soundsource.write" = 'soundsource.write';
```

### export audio

```ts
readonly export audio: "export.invoke" = 'export.invoke';
```

### export lrc

```ts
readonly export lrc: "export.invoke" = 'export.invoke';
```

### export midi

```ts
readonly export midi: "export.invoke" = 'export.invoke';
```

### export song-template

```ts
readonly export song-template: "export.invoke" = 'export.invoke';
```

### export timeline

```ts
readonly export timeline: "export.invoke" = 'export.invoke';
```

### export video

```ts
readonly export video: "export.invoke" = 'export.invoke';
```

### export vocal-sample

```ts
readonly export vocal-sample: "export.invoke" = 'export.invoke';
```

### fx add

```ts
readonly fx add: "audioplugin.write" = 'audioplugin.write';
```

### fx apply-chain

```ts
readonly fx apply-chain: "audioplugin.write" = 'audioplugin.write';
```

### fx export-chain

```ts
readonly fx export-chain: "audioplugin.read" = 'audioplugin.read';
```

### fx find-chains

```ts
readonly fx find-chains: "audioplugin.read" = 'audioplugin.read';
```

### fx import-chain

```ts
readonly fx import-chain: "audioplugin.write" = 'audioplugin.write';
```

### fx insert-chain

```ts
readonly fx insert-chain: "audioplugin.write" = 'audioplugin.write';
```

### fx list-chains

```ts
readonly fx list-chains: "audioplugin.read" = 'audioplugin.read';
```

### fx move-chain

```ts
readonly fx move-chain: "audioplugin.write" = 'audioplugin.write';
```

### fx remove

```ts
readonly fx remove: "audioplugin.write" = 'audioplugin.write';
```

### fx remove-chain

```ts
readonly fx remove-chain: "audioplugin.write" = 'audioplugin.write';
```

### fx reorder

```ts
readonly fx reorder: "audioplugin.write" = 'audioplugin.write';
```

### fx save-chain

```ts
readonly fx save-chain: "audioplugin.write" = 'audioplugin.write';
```

### fx set-room

```ts
readonly fx set-room: "audioplugin.write" = 'audioplugin.write';
```

### generative add-a-layer

```ts
readonly generative add-a-layer: "generative.add-a-layer" = 'generative.add-a-layer';
```

### generative inspire-me

```ts
readonly generative inspire-me: "generative.inspire-me" = 'generative.inspire-me';
```

### generative inspire-me history get

```ts
readonly generative inspire-me history get: "generative-history.read" = 'generative-history.read';
```

### generative inspire-me history list

```ts
readonly generative inspire-me history list: "generative-history.read" = 'generative-history.read';
```

### generative music-enhancer

```ts
readonly generative music-enhancer: "generative.music-enhancer" = 'generative.music-enhancer';
```

### generative music-enhancer history get

```ts
readonly generative music-enhancer history get: "generative-history.read" = 'generative-history.read';
```

### generative music-enhancer history list

```ts
readonly generative music-enhancer history list: "generative-history.read" = 'generative-history.read';
```

### generative stem-splitter

```ts
readonly generative stem-splitter: "generative.stem-splitter" = 'generative.stem-splitter';
```

### generative vocal-to-midi

```ts
readonly generative vocal-to-midi: "generative.vocal-to-midi" = 'generative.vocal-to-midi';
```

### generative voice-changer convert

```ts
readonly generative voice-changer convert: "generative.voice-changer" = 'generative.voice-changer';
```

### generative voice-changer models

```ts
readonly generative voice-changer models: "generative.voice-changer" = 'generative.voice-changer';
```

### history list

```ts
readonly history list: "history.read" = 'history.read';
```

### history redo

```ts
readonly history redo: "history.control" = 'history.control';
```

### history undo

```ts
readonly history undo: "history.control" = 'history.control';
```

### import file

```ts
readonly import file: "import.invoke" = 'import.invoke';
```

### instrument set

```ts
readonly instrument set: "soundsource.write" = 'soundsource.write';
```

### job cancel

```ts
readonly job cancel: "job.control" = 'job.control';
```

### job discard-result

```ts
readonly job discard-result: "job.control" = 'job.control';
```

### job download

```ts
readonly job download: "job.control" = 'job.control';
```

### job get

```ts
readonly job get: "job.read" = 'job.read';
```

### job list

```ts
readonly job list: "job.read" = 'job.read';
```

### job place

```ts
readonly job place: "clip.write" = 'clip.write';
```

### job results

```ts
readonly job results: "job.read" = 'job.read';
```

### job wait

```ts
readonly job wait: "job.read" = 'job.read';
```

### lyric fill

```ts
readonly lyric fill: "lyric.write" = 'lyric.write';
```

### midiparam clear

```ts
readonly midiparam clear: "midiparam.write" = 'midiparam.write';
```

### midiparam list-lanes

```ts
readonly midiparam list-lanes: "midiparam.read" = 'midiparam.read';
```

### midiparam read

```ts
readonly midiparam read: "midiparam.read" = 'midiparam.read';
```

### midiparam remove-point

```ts
readonly midiparam remove-point: "midiparam.write" = 'midiparam.write';
```

### midiparam set-point

```ts
readonly midiparam set-point: "midiparam.write" = 'midiparam.write';
```

### midiparam set-velocity

```ts
readonly midiparam set-velocity: "midiparam.write" = 'midiparam.write';
```

### midiparam velocity

```ts
readonly midiparam velocity: "midiparam.read" = 'midiparam.read';
```

### midiparam write

```ts
readonly midiparam write: "midiparam.write" = 'midiparam.write';
```

### note add

```ts
readonly note add: "note.write" = 'note.write';
```

### note delete

```ts
readonly note delete: "note.write" = 'note.write';
```

### note get

```ts
readonly note get: "note.read" = 'note.read';
```

### note move

```ts
readonly note move: "note.write" = 'note.write';
```

### note resize

```ts
readonly note resize: "note.write" = 'note.write';
```

### note set-articulation

```ts
readonly note set-articulation: "note.write" = 'note.write';
```

### note set-grapheme

```ts
readonly note set-grapheme: "note.write" = 'note.write';
```

### note set-language

```ts
readonly note set-language: "note.write" = 'note.write';
```

### note split

```ts
readonly note split: "note.write" = 'note.write';
```

### phoneme g2p

```ts
readonly phoneme g2p: "lyric.read" = 'lyric.read';
```

### phoneme inventory

```ts
readonly phoneme inventory: "lyric.read" = 'lyric.read';
```

### phoneme list

```ts
readonly phoneme list: "lyric.read" = 'lyric.read';
```

### phoneme move-boundary

```ts
readonly phoneme move-boundary: "lyric.write" = 'lyric.write';
```

### phoneme reset

```ts
readonly phoneme reset: "lyric.write" = 'lyric.write';
```

### phoneme reset-override

```ts
readonly phoneme reset-override: "lyric.write" = 'lyric.write';
```

### phoneme reset-timing

```ts
readonly phoneme reset-timing: "lyric.write" = 'lyric.write';
```

### phoneme set

```ts
readonly phoneme set: "lyric.write" = 'lyric.write';
```

### phoneme set-consonant-timing

```ts
readonly phoneme set-consonant-timing: "lyric.write" = 'lyric.write';
```

### project collect-save

```ts
readonly project collect-save: "project.lifecycle" = 'project.lifecycle';
```

### project dirty

```ts
readonly project dirty: "project.read" = 'project.read';
```

### project info

```ts
readonly project info: "project.read" = 'project.read';
```

### project new

```ts
readonly project new: "project.lifecycle" = 'project.lifecycle';
```

### project open

```ts
readonly project open: "project.lifecycle" = 'project.lifecycle';
```

### project recent

```ts
readonly project recent: "project.read" = 'project.read';
```

### project recent-clear

```ts
readonly project recent-clear: "project.lifecycle" = 'project.lifecycle';
```

### project save

```ts
readonly project save: "project.lifecycle" = 'project.lifecycle';
```

### project save-as

```ts
readonly project save-as: "project.lifecycle" = 'project.lifecycle';
```

### project synthesis-status

```ts
readonly project synthesis-status: "project.read" = 'project.read';
```

### recording start

```ts
readonly recording start: "recording.control" = 'recording.control';
```

### recording stop

```ts
readonly recording stop: "recording.control" = 'recording.control';
```

### selection get

```ts
readonly selection get: "selection.read" = 'selection.read';
```

### selection set

```ts
readonly selection set: "selection.write" = 'selection.write';
```

### sound-source get

```ts
readonly sound-source get: "soundsource.read" = 'soundsource.read';
```

### sound-source list

```ts
readonly sound-source list: "soundsource.read" = 'soundsource.read';
```

### sound-source load

```ts
readonly sound-source load: "soundsource.write" = 'soundsource.write';
```

### sound-source set

```ts
readonly sound-source set: "soundsource.write" = 'soundsource.write';
```

### sound-source tags

```ts
readonly sound-source tags: "soundsource.read" = 'soundsource.read';
```

### sound-source unload

```ts
readonly sound-source unload: "soundsource.write" = 'soundsource.write';
```

### tempo analyze

```ts
readonly tempo analyze: "tempo.analyze" = 'tempo.analyze';
```

### tempo apply-beat-analysis

```ts
readonly tempo apply-beat-analysis: "tempo.applyV2" = 'tempo.applyV2';
```

### tempo get

```ts
readonly tempo get: "tempo.read" = 'tempo.read';
```

### tempo get-analysis

```ts
readonly tempo get-analysis: "tempo.read" = 'tempo.read';
```

### tempo points

```ts
readonly tempo points: "tempo.read" = 'tempo.read';
```

### tempo remove-point

```ts
readonly tempo remove-point: "tempo.write" = 'tempo.write';
```

### tempo set

```ts
readonly tempo set: "tempo.write" = 'tempo.write';
```

### tempo set-display-range

```ts
readonly tempo set-display-range: "tempo.write" = 'tempo.write';
```

### tempo set-point

```ts
readonly tempo set-point: "tempo.write" = 'tempo.write';
```

### timesig get

```ts
readonly timesig get: "timesig.read" = 'timesig.read';
```

### timesig list

```ts
readonly timesig list: "timesig.read" = 'timesig.read';
```

### timesig remove-at

```ts
readonly timesig remove-at: "timesig.write" = 'timesig.write';
```

### timesig set

```ts
readonly timesig set: "timesig.write" = 'timesig.write';
```

### timesig set-at

```ts
readonly timesig set-at: "timesig.write" = 'timesig.write';
```

### track audition note

```ts
readonly track audition note: "track.audition" = 'track.audition';
```

### track audition note-clear

```ts
readonly track audition note-clear: "track.audition" = 'track.audition';
```

### track audition note-off

```ts
readonly track audition note-off: "track.audition" = 'track.audition';
```

### track audition note-on

```ts
readonly track audition note-on: "track.audition" = 'track.audition';
```

### track create

```ts
readonly track create: "track.write" = 'track.write';
```

### track delete

```ts
readonly track delete: "track.write" = 'track.write';
```

### track duplicate

```ts
readonly track duplicate: "track.write" = 'track.write';
```

### track get

```ts
readonly track get: "track.read" = 'track.read';
```

### track list

```ts
readonly track list: "track.read" = 'track.read';
```

### track rename

```ts
readonly track rename: "track.write" = 'track.write';
```

### track reorder

```ts
readonly track reorder: "track.write" = 'track.write';
```

### track resolve

```ts
readonly track resolve: "track.read" = 'track.read';
```

### track set

```ts
readonly track set: "track.write" = 'track.write';
```

### track set-input

```ts
readonly track set-input: "track.write" = 'track.write';
```

### track set-language

```ts
readonly track set-language: "track.write" = 'track.write';
```

### transport loop

```ts
readonly transport loop: "transport.state" = 'transport.state';
```

### transport metronome

```ts
readonly transport metronome: "transport.control" = 'transport.control';
```

### transport play

```ts
readonly transport play: "transport.control" = 'transport.control';
```

### transport seek

```ts
readonly transport seek: "transport.control" = 'transport.control';
```

### transport set-loop

```ts
readonly transport set-loop: "transport.control" = 'transport.control';
```

### transport state

```ts
readonly transport state: "transport.state" = 'transport.state';
```

### transport stop

```ts
readonly transport stop: "transport.control" = 'transport.control';
```

### transport toggle

```ts
readonly transport toggle: "transport.control" = 'transport.control';
```

### ui get

```ts
readonly ui get: "ui.state" = 'ui.state';
```

### ui hide-panel

```ts
readonly ui hide-panel: "ui.control" = 'ui.control';
```

### ui hide-special-track

```ts
readonly ui hide-special-track: "ui.control" = 'ui.control';
```

### ui hide-window

```ts
readonly ui hide-window: "ui.control" = 'ui.control';
```

### ui show-panel

```ts
readonly ui show-panel: "ui.control" = 'ui.control';
```

### ui show-special-track

```ts
readonly ui show-special-track: "ui.control" = 'ui.control';
```

### ui show-window

```ts
readonly ui show-window: "ui.control" = 'ui.control';
```

### vocalparam layers

```ts
readonly vocalparam layers: "vocalparam.read" = 'vocalparam.read';
```

### vocalparam read

```ts
readonly vocalparam read: "vocalparam.read" = 'vocalparam.read';
```

### vocalparam set-voicing

```ts
readonly vocalparam set-voicing: "vocalparam.write" = 'vocalparam.write';
```

### vocalparam voicing

```ts
readonly vocalparam voicing: "vocalparam.read" = 'vocalparam.read';
```

### vocalparam write

```ts
readonly vocalparam write: "vocalparam.write" = 'vocalparam.write';
```

### voice collect

```ts
readonly voice collect: "voice.write" = 'voice.write';
```

### voice community

```ts
readonly voice community: "voice.read" = 'voice.read';
```

### voice seeds

```ts
readonly voice seeds: "voice.read" = 'voice.read';
```

### voice synth-models

```ts
readonly voice synth-models: "voice.read" = 'voice.read';
```
