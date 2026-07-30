# Variable: OPERATIONS

```ts
const OPERATIONS: readonly [{
  capability: "caret.read";
  domain: "caret";
  fingerprintPrecondition: false;
  method: "get";
  mutating: false;
  path: "caret get";
  takesParams: true;
  ungated: false;
}, {
  capability: "caret.write";
  domain: "caret";
  fingerprintPrecondition: false;
  method: "set";
  mutating: true;
  path: "caret set";
  takesParams: true;
  ungated: false;
}, {
  capability: "clip.read";
  domain: "clip";
  fingerprintPrecondition: false;
  method: "audioContent";
  mutating: false;
  path: "clip audio-content";
  takesParams: true;
  ungated: false;
}, {
  capability: "clip.write";
  domain: "clip";
  fingerprintPrecondition: false;
  method: "create";
  mutating: true;
  path: "clip create";
  takesParams: true;
  ungated: false;
}, {
  capability: "clip.read";
  domain: "clip";
  fingerprintPrecondition: false;
  method: "get";
  mutating: false;
  path: "clip get";
  takesParams: true;
  ungated: false;
}, {
  capability: "clip.read";
  domain: "clip";
  fingerprintPrecondition: false;
  method: "list";
  mutating: false;
  path: "clip list";
  takesParams: true;
  ungated: false;
}, {
  capability: "clip.read";
  domain: "clip";
  fingerprintPrecondition: false;
  method: "lyrics";
  mutating: false;
  path: "clip lyrics";
  takesParams: true;
  ungated: false;
}, {
  capability: "clip.write";
  domain: "clip";
  fingerprintPrecondition: false;
  method: "moveEdges";
  mutating: true;
  path: "clip move-edges";
  takesParams: true;
  ungated: false;
}, {
  capability: "clip.read";
  domain: "clip";
  fingerprintPrecondition: false;
  method: "noteContent";
  mutating: false;
  path: "clip note-content";
  takesParams: true;
  ungated: false;
}, {
  capability: "clip.write";
  domain: "clip";
  fingerprintPrecondition: true;
  method: "replaceContent";
  mutating: true;
  path: "clip replace-content";
  takesParams: true;
  ungated: false;
}, {
  capability: "convert.editor-to-global";
  domain: "convert";
  fingerprintPrecondition: false;
  method: "editorToGlobal";
  mutating: false;
  path: "convert editor-to-global";
  takesParams: true;
  ungated: true;
}, {
  capability: "convert.global-to-editor";
  domain: "convert";
  fingerprintPrecondition: false;
  method: "globalToEditor";
  mutating: false;
  path: "convert global-to-editor";
  takesParams: true;
  ungated: true;
}, {
  capability: "convert.measure-to-tick";
  domain: "convert";
  fingerprintPrecondition: false;
  method: "measureToTick";
  mutating: false;
  path: "convert measure-to-tick";
  takesParams: true;
  ungated: true;
}, {
  capability: "convert.tick-to-measure";
  domain: "convert";
  fingerprintPrecondition: false;
  method: "tickToMeasure";
  mutating: false;
  path: "convert tick-to-measure";
  takesParams: true;
  ungated: true;
}, {
  capability: "convert.tick-to-time";
  domain: "convert";
  fingerprintPrecondition: false;
  method: "tickToTime";
  mutating: false;
  path: "convert tick-to-time";
  takesParams: true;
  ungated: true;
}, {
  capability: "convert.time-to-tick";
  domain: "convert";
  fingerprintPrecondition: false;
  method: "timeToTick";
  mutating: false;
  path: "convert time-to-tick";
  takesParams: true;
  ungated: true;
}, {
  capability: "device.read";
  domain: "device";
  fingerprintPrecondition: false;
  method: "current";
  mutating: false;
  path: "device current";
  takesParams: false;
  ungated: false;
}, {
  capability: "device.read";
  domain: "device";
  fingerprintPrecondition: false;
  method: "list";
  mutating: false;
  path: "device list";
  takesParams: false;
  ungated: false;
}, {
  capability: "device.write";
  domain: "device";
  fingerprintPrecondition: false;
  method: "setAudio";
  mutating: true;
  path: "device set-audio";
  takesParams: true;
  ungated: false;
}, {
  capability: "editor.read";
  domain: "editor";
  fingerprintPrecondition: false;
  method: "currentClip";
  mutating: false;
  path: "editor current-clip";
  takesParams: false;
  ungated: false;
}, {
  capability: "editor.write";
  domain: "editor";
  fingerprintPrecondition: false;
  method: "open";
  mutating: true;
  path: "editor open";
  takesParams: false;
  ungated: false;
}, {
  capability: "editor.read";
  domain: "editor";
  fingerprintPrecondition: false;
  method: "status";
  mutating: false;
  path: "editor status";
  takesParams: false;
  ungated: false;
}, {
  capability: "editor.read";
  domain: "editor";
  fingerprintPrecondition: false;
  method: "tickRange";
  mutating: false;
  path: "editor tick-range";
  takesParams: false;
  ungated: false;
}, {
  capability: "history.read";
  domain: "history";
  fingerprintPrecondition: false;
  method: "list";
  mutating: false;
  path: "history list";
  takesParams: true;
  ungated: false;
}, {
  capability: "history.control";
  domain: "history";
  fingerprintPrecondition: false;
  method: "redo";
  mutating: true;
  path: "history redo";
  takesParams: false;
  ungated: false;
}, {
  capability: "history.control";
  domain: "history";
  fingerprintPrecondition: false;
  method: "undo";
  mutating: true;
  path: "history undo";
  takesParams: false;
  ungated: false;
}, {
  capability: "job.control";
  domain: "job";
  fingerprintPrecondition: false;
  method: "cancel";
  mutating: true;
  path: "job cancel";
  takesParams: true;
  ungated: false;
}, {
  capability: "job.control";
  domain: "job";
  fingerprintPrecondition: false;
  method: "discardResult";
  mutating: true;
  path: "job discard-result";
  takesParams: true;
  ungated: false;
}, {
  capability: "job.read";
  domain: "job";
  fingerprintPrecondition: false;
  method: "get";
  mutating: false;
  path: "job get";
  takesParams: true;
  ungated: false;
}, {
  capability: "job.read";
  domain: "job";
  fingerprintPrecondition: false;
  method: "list";
  mutating: false;
  path: "job list";
  takesParams: true;
  ungated: false;
}, {
  capability: "clip.write";
  domain: "job";
  fingerprintPrecondition: false;
  method: "place";
  mutating: true;
  path: "job place";
  takesParams: true;
  ungated: false;
}, {
  capability: "job.read";
  domain: "job";
  fingerprintPrecondition: false;
  method: "results";
  mutating: false;
  path: "job results";
  takesParams: true;
  ungated: false;
}, {
  capability: "job.read";
  domain: "job";
  fingerprintPrecondition: false;
  method: "wait";
  mutating: false;
  path: "job wait";
  takesParams: true;
  ungated: false;
}, {
  capability: "note.write";
  domain: "note";
  fingerprintPrecondition: true;
  method: "add";
  mutating: true;
  path: "note add";
  takesParams: true;
  ungated: false;
}, {
  capability: "note.write";
  domain: "note";
  fingerprintPrecondition: true;
  method: "delete";
  mutating: true;
  path: "note delete";
  takesParams: true;
  ungated: false;
}, {
  capability: "note.write";
  domain: "note";
  fingerprintPrecondition: true;
  method: "move";
  mutating: true;
  path: "note move";
  takesParams: true;
  ungated: false;
}, {
  capability: "note.write";
  domain: "note";
  fingerprintPrecondition: true;
  method: "resize";
  mutating: true;
  path: "note resize";
  takesParams: true;
  ungated: false;
}, {
  capability: "note.write";
  domain: "note";
  fingerprintPrecondition: true;
  method: "setLyric";
  mutating: true;
  path: "note set-lyric";
  takesParams: true;
  ungated: false;
}, {
  capability: "project.lifecycle";
  domain: "project";
  fingerprintPrecondition: false;
  method: "collectSave";
  mutating: true;
  path: "project collect-save";
  takesParams: true;
  ungated: false;
}, {
  capability: "project.read";
  domain: "project";
  fingerprintPrecondition: false;
  method: "dirty";
  mutating: false;
  path: "project dirty";
  takesParams: false;
  ungated: false;
}, {
  capability: "project.read";
  domain: "project";
  fingerprintPrecondition: false;
  method: "info";
  mutating: false;
  path: "project info";
  takesParams: false;
  ungated: false;
}, {
  capability: "project.lifecycle";
  domain: "project";
  fingerprintPrecondition: false;
  method: "new";
  mutating: true;
  path: "project new";
  takesParams: true;
  ungated: false;
}, {
  capability: "project.lifecycle";
  domain: "project";
  fingerprintPrecondition: false;
  method: "open";
  mutating: true;
  path: "project open";
  takesParams: true;
  ungated: false;
}, {
  capability: "project.read";
  domain: "project";
  fingerprintPrecondition: false;
  method: "recent";
  mutating: false;
  path: "project recent";
  takesParams: false;
  ungated: false;
}, {
  capability: "project.lifecycle";
  domain: "project";
  fingerprintPrecondition: false;
  method: "recentClear";
  mutating: true;
  path: "project recent-clear";
  takesParams: false;
  ungated: false;
}, {
  capability: "project.lifecycle";
  domain: "project";
  fingerprintPrecondition: false;
  method: "save";
  mutating: true;
  path: "project save";
  takesParams: false;
  ungated: false;
}, {
  capability: "project.lifecycle";
  domain: "project";
  fingerprintPrecondition: false;
  method: "saveAs";
  mutating: true;
  path: "project save-as";
  takesParams: true;
  ungated: false;
}, {
  capability: "project.lifecycle";
  domain: "project";
  entitlement: "membership";
  fingerprintPrecondition: false;
  method: "saveTemplate";
  mutating: true;
  path: "project save-template";
  takesParams: true;
  ungated: false;
}, {
  capability: "project.read";
  domain: "project";
  fingerprintPrecondition: false;
  method: "synthesisStatus";
  mutating: false;
  path: "project synthesis-status";
  takesParams: false;
  ungated: false;
}, {
  capability: "recording.control";
  domain: "recording";
  fingerprintPrecondition: false;
  method: "start";
  mutating: true;
  path: "recording start";
  takesParams: false;
  ungated: false;
}, {
  capability: "recording.control";
  domain: "recording";
  fingerprintPrecondition: false;
  method: "stop";
  mutating: true;
  path: "recording stop";
  takesParams: false;
  ungated: false;
}, {
  capability: "selection.read";
  domain: "selection";
  fingerprintPrecondition: false;
  method: "get";
  mutating: false;
  path: "selection get";
  takesParams: true;
  ungated: false;
}, {
  capability: "selection.write";
  domain: "selection";
  fingerprintPrecondition: false;
  method: "set";
  mutating: true;
  path: "selection set";
  takesParams: true;
  ungated: false;
}, {
  capability: "tempo.read";
  domain: "tempo";
  fingerprintPrecondition: false;
  method: "get";
  mutating: false;
  path: "tempo get";
  takesParams: false;
  ungated: false;
}, {
  capability: "tempo.write";
  domain: "tempo";
  fingerprintPrecondition: false;
  method: "set";
  mutating: true;
  path: "tempo set";
  takesParams: true;
  ungated: false;
}, {
  capability: "timesig.read";
  domain: "timesig";
  fingerprintPrecondition: false;
  method: "get";
  mutating: false;
  path: "timesig get";
  takesParams: false;
  ungated: false;
}, {
  capability: "timesig.write";
  domain: "timesig";
  fingerprintPrecondition: false;
  method: "set";
  mutating: true;
  path: "timesig set";
  takesParams: true;
  ungated: false;
}, {
  capability: "track.write";
  domain: "track";
  fingerprintPrecondition: false;
  method: "delete";
  mutating: true;
  path: "track delete";
  takesParams: false;
  ungated: false;
}, {
  capability: "track.read";
  domain: "track";
  fingerprintPrecondition: false;
  method: "get";
  mutating: false;
  path: "track get";
  takesParams: true;
  ungated: false;
}, {
  capability: "track.read";
  domain: "track";
  fingerprintPrecondition: false;
  method: "list";
  mutating: false;
  path: "track list";
  takesParams: false;
  ungated: false;
}, {
  capability: "track.write";
  domain: "track";
  fingerprintPrecondition: false;
  method: "rename";
  mutating: true;
  path: "track rename";
  takesParams: true;
  ungated: false;
}, {
  capability: "track.write";
  domain: "track";
  fingerprintPrecondition: false;
  method: "set";
  mutating: true;
  path: "track set";
  takesParams: true;
  ungated: false;
}, {
  capability: "track.write";
  domain: "track";
  fingerprintPrecondition: false;
  method: "setRecord";
  mutating: true;
  path: "track set-record";
  takesParams: true;
  ungated: false;
}, {
  capability: "track.read";
  domain: "track";
  fingerprintPrecondition: false;
  method: "singerRecipe";
  mutating: false;
  path: "track singer-recipe";
  takesParams: true;
  ungated: false;
}, {
  capability: "transport.state";
  domain: "transport";
  fingerprintPrecondition: false;
  method: "loop";
  mutating: false;
  path: "transport loop";
  takesParams: false;
  ungated: false;
}, {
  capability: "transport.control";
  domain: "transport";
  fingerprintPrecondition: false;
  method: "metronome";
  mutating: true;
  path: "transport metronome";
  takesParams: true;
  ungated: false;
}, {
  capability: "transport.control";
  domain: "transport";
  fingerprintPrecondition: false;
  method: "play";
  mutating: true;
  path: "transport play";
  takesParams: false;
  ungated: false;
}, {
  capability: "transport.control";
  domain: "transport";
  fingerprintPrecondition: false;
  method: "seek";
  mutating: true;
  path: "transport seek";
  takesParams: true;
  ungated: false;
}, {
  capability: "transport.control";
  domain: "transport";
  fingerprintPrecondition: true;
  method: "setLoop";
  mutating: true;
  path: "transport set-loop";
  takesParams: true;
  ungated: false;
}, {
  capability: "transport.state";
  domain: "transport";
  fingerprintPrecondition: false;
  method: "state";
  mutating: false;
  path: "transport state";
  takesParams: false;
  ungated: false;
}, {
  capability: "transport.control";
  domain: "transport";
  fingerprintPrecondition: false;
  method: "stop";
  mutating: true;
  path: "transport stop";
  takesParams: false;
  ungated: false;
}, {
  capability: "transport.control";
  domain: "transport";
  fingerprintPrecondition: false;
  method: "toggle";
  mutating: true;
  path: "transport toggle";
  takesParams: false;
  ungated: false;
}, {
  capability: "ui.state";
  domain: "ui";
  fingerprintPrecondition: false;
  method: "get";
  mutating: false;
  path: "ui get";
  takesParams: false;
  ungated: false;
}, {
  capability: "ui.control";
  domain: "ui";
  fingerprintPrecondition: false;
  method: "hidePanel";
  mutating: true;
  path: "ui hide-panel";
  takesParams: true;
  ungated: false;
}, {
  capability: "ui.control";
  domain: "ui";
  fingerprintPrecondition: false;
  method: "hideSpecialTrack";
  mutating: true;
  path: "ui hide-special-track";
  takesParams: true;
  ungated: false;
}, {
  capability: "ui.control";
  domain: "ui";
  fingerprintPrecondition: false;
  method: "hideWindow";
  mutating: true;
  path: "ui hide-window";
  takesParams: true;
  ungated: false;
}, {
  capability: "ui.control";
  domain: "ui";
  fingerprintPrecondition: false;
  method: "showPanel";
  mutating: true;
  path: "ui show-panel";
  takesParams: true;
  ungated: false;
}, {
  capability: "ui.control";
  domain: "ui";
  fingerprintPrecondition: false;
  method: "showSpecialTrack";
  mutating: true;
  path: "ui show-special-track";
  takesParams: true;
  ungated: false;
}, {
  capability: "ui.control";
  domain: "ui";
  fingerprintPrecondition: false;
  method: "showWindow";
  mutating: true;
  path: "ui show-window";
  takesParams: true;
  ungated: false;
}, {
  capability: "vocalparam.read";
  domain: "vocalparam";
  fingerprintPrecondition: false;
  method: "layers";
  mutating: false;
  path: "vocalparam layers";
  takesParams: true;
  ungated: false;
}, {
  bulkEncoding: "base64";
  capability: "vocalparam.read";
  domain: "vocalparam";
  fingerprintPrecondition: false;
  method: "read";
  mutating: false;
  path: "vocalparam read";
  takesParams: true;
  ungated: false;
}, {
  bulkEncoding: "base64";
  capability: "vocalparam.write";
  domain: "vocalparam";
  fingerprintPrecondition: true;
  method: "write";
  mutating: true;
  path: "vocalparam write";
  takesParams: true;
  ungated: false;
}, {
  capability: "voice.write";
  domain: "voice";
  fingerprintPrecondition: false;
  method: "collect";
  mutating: true;
  path: "voice collect";
  takesParams: true;
  ungated: false;
}, {
  capability: "voice.read";
  domain: "voice";
  fingerprintPrecondition: false;
  method: "communityList";
  mutating: false;
  path: "voice community-list";
  takesParams: true;
  ungated: false;
}, {
  capability: "voice.read";
  domain: "voice";
  fingerprintPrecondition: false;
  method: "communityPages";
  mutating: false;
  path: "voice community-pages";
  takesParams: true;
  ungated: false;
}, {
  capability: "voice.read";
  domain: "voice";
  fingerprintPrecondition: false;
  method: "list";
  mutating: false;
  path: "voice list";
  takesParams: true;
  ungated: false;
}, {
  capability: "voice.write";
  domain: "voice";
  fingerprintPrecondition: false;
  method: "load";
  mutating: true;
  path: "voice load";
  takesParams: true;
  ungated: false;
}, {
  capability: "voice.write";
  domain: "voice";
  fingerprintPrecondition: false;
  method: "mixCreate";
  mutating: true;
  path: "voice mix-create";
  takesParams: true;
  ungated: false;
}, {
  capability: "voice.write";
  domain: "voice";
  fingerprintPrecondition: false;
  method: "mixDelete";
  mutating: true;
  path: "voice mix-delete";
  takesParams: true;
  ungated: false;
}, {
  capability: "voice.write";
  domain: "voice";
  fingerprintPrecondition: false;
  method: "mixEdit";
  mutating: true;
  path: "voice mix-edit";
  takesParams: true;
  ungated: false;
}, {
  capability: "voice.read";
  domain: "voice";
  fingerprintPrecondition: false;
  method: "tags";
  mutating: false;
  path: "voice tags";
  takesParams: true;
  ungated: false;
}, {
  capability: "voice.write";
  domain: "voice";
  fingerprintPrecondition: false;
  method: "unload";
  mutating: true;
  path: "voice unload";
  takesParams: true;
  ungated: false;
}];
```

Every operation in this artifact, sorted by path.
