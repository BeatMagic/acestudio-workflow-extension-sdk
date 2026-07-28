# Variable: REQUIRED\_TOKENS

```ts
const REQUIRED_TOKENS: {
  caret get: "caret.read";
  caret set: "caret.write";
  clip audio-content: "clip.read";
  clip create: "clip.write";
  clip get: "clip.read";
  clip list: "clip.read";
  clip lyrics: "clip.read";
  clip move-edges: "clip.write";
  clip note-content: "clip.read";
  clip replace-content: "clip.write";
  device current: "device.read";
  device list: "device.read";
  editor current-clip: "editor.read";
  editor open: "editor.write";
  editor status: "editor.read";
  editor tick-range: "editor.read";
  job cancel: "job.control";
  job discard-result: "job.control";
  job get: "job.read";
  job list: "job.read";
  job place: "clip.write";
  job results: "job.read";
  job wait: "job.read";
  mixer get: "ui.view";
  mixer hide: "ui.view";
  mixer show: "ui.view";
  note add: "note.write";
  note delete: "note.write";
  note move: "note.write";
  note resize: "note.write";
  note set-lyric: "note.write";
  project collect-save: "project.lifecycle";
  project dirty: "project.read";
  project info: "project.read";
  project new: "project.lifecycle";
  project open: "project.lifecycle";
  project recent: "project.read";
  project recent-clear: "project.lifecycle";
  project save: "project.lifecycle";
  project save-as: "project.lifecycle";
  project save-template: "project.lifecycle";
  project synthesis-status: "project.read";
  selection get: "selection.read";
  selection set: "selection.write";
  special-tracks get: "ui.view";
  special-tracks hide: "ui.view";
  special-tracks show: "ui.view";
  tempo get: "tempo.read";
  tempo set: "tempo.write";
  timesig get: "timesig.read";
  timesig set: "timesig.write";
  track delete: "track.write";
  track get: "track.read";
  track list: "track.read";
  track rename: "track.write";
  track set: "track.write";
  track set-record: "track.write";
  track singer-recipe: "track.read";
  transport loop: "transport.state";
  transport metronome: "transport.control";
  transport play: "transport.control";
  transport seek: "transport.control";
  transport set-loop: "transport.control";
  transport state: "transport.state";
  transport stop: "transport.control";
  transport toggle: "transport.control";
  voice collect: "voice.write";
  voice community-list: "voice.read";
  voice community-pages: "voice.read";
  voice list: "voice.read";
  voice load: "voice.write";
  voice tags: "voice.read";
  voice unload: "voice.write";
};
```

The token each operation requires, for the pre-wire guard: a call the session's grant cannot reach fails locally with the identical typed `CAPABILITY_DENIED` the host would have returned. Ungated operations are absent — they need no token.

## Type Declaration

### caret get

```ts
readonly caret get: "caret.read" = 'caret.read';
```

### caret set

```ts
readonly caret set: "caret.write" = 'caret.write';
```

### clip audio-content

```ts
readonly clip audio-content: "clip.read" = 'clip.read';
```

### clip create

```ts
readonly clip create: "clip.write" = 'clip.write';
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

### clip move-edges

```ts
readonly clip move-edges: "clip.write" = 'clip.write';
```

### clip note-content

```ts
readonly clip note-content: "clip.read" = 'clip.read';
```

### clip replace-content

```ts
readonly clip replace-content: "clip.write" = 'clip.write';
```

### device current

```ts
readonly device current: "device.read" = 'device.read';
```

### device list

```ts
readonly device list: "device.read" = 'device.read';
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

### job cancel

```ts
readonly job cancel: "job.control" = 'job.control';
```

### job discard-result

```ts
readonly job discard-result: "job.control" = 'job.control';
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

### mixer get

```ts
readonly mixer get: "ui.view" = 'ui.view';
```

### mixer hide

```ts
readonly mixer hide: "ui.view" = 'ui.view';
```

### mixer show

```ts
readonly mixer show: "ui.view" = 'ui.view';
```

### note add

```ts
readonly note add: "note.write" = 'note.write';
```

### note delete

```ts
readonly note delete: "note.write" = 'note.write';
```

### note move

```ts
readonly note move: "note.write" = 'note.write';
```

### note resize

```ts
readonly note resize: "note.write" = 'note.write';
```

### note set-lyric

```ts
readonly note set-lyric: "note.write" = 'note.write';
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

### project save-template

```ts
readonly project save-template: "project.lifecycle" = 'project.lifecycle';
```

### project synthesis-status

```ts
readonly project synthesis-status: "project.read" = 'project.read';
```

### selection get

```ts
readonly selection get: "selection.read" = 'selection.read';
```

### selection set

```ts
readonly selection set: "selection.write" = 'selection.write';
```

### special-tracks get

```ts
readonly special-tracks get: "ui.view" = 'ui.view';
```

### special-tracks hide

```ts
readonly special-tracks hide: "ui.view" = 'ui.view';
```

### special-tracks show

```ts
readonly special-tracks show: "ui.view" = 'ui.view';
```

### tempo get

```ts
readonly tempo get: "tempo.read" = 'tempo.read';
```

### tempo set

```ts
readonly tempo set: "tempo.write" = 'tempo.write';
```

### timesig get

```ts
readonly timesig get: "timesig.read" = 'timesig.read';
```

### timesig set

```ts
readonly timesig set: "timesig.write" = 'timesig.write';
```

### track delete

```ts
readonly track delete: "track.write" = 'track.write';
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

### track set

```ts
readonly track set: "track.write" = 'track.write';
```

### track set-record

```ts
readonly track set-record: "track.write" = 'track.write';
```

### track singer-recipe

```ts
readonly track singer-recipe: "track.read" = 'track.read';
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

### voice collect

```ts
readonly voice collect: "voice.write" = 'voice.write';
```

### voice community-list

```ts
readonly voice community-list: "voice.read" = 'voice.read';
```

### voice community-pages

```ts
readonly voice community-pages: "voice.read" = 'voice.read';
```

### voice list

```ts
readonly voice list: "voice.read" = 'voice.read';
```

### voice load

```ts
readonly voice load: "voice.write" = 'voice.write';
```

### voice tags

```ts
readonly voice tags: "voice.read" = 'voice.read';
```

### voice unload

```ts
readonly voice unload: "voice.write" = 'voice.write';
```
