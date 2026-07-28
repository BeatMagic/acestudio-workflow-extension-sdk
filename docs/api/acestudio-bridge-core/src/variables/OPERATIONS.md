# Variable: OPERATIONS

```ts
const OPERATIONS: readonly [{
  capability: "caret.read";
  domain: "caret";
  method: "get";
  mutating: false;
  path: "caret get";
  takesParams: true;
  ungated: false;
}, {
  capability: "caret.write";
  domain: "caret";
  method: "set";
  mutating: true;
  path: "caret set";
  takesParams: true;
  ungated: false;
}, {
  capability: "clip.read";
  domain: "clip";
  method: "audioContent";
  mutating: false;
  path: "clip audio-content";
  takesParams: true;
  ungated: false;
}, {
  capability: "clip.write";
  domain: "clip";
  method: "create";
  mutating: true;
  path: "clip create";
  takesParams: true;
  ungated: false;
}, {
  capability: "clip.read";
  domain: "clip";
  method: "get";
  mutating: false;
  path: "clip get";
  takesParams: true;
  ungated: false;
}, {
  capability: "clip.read";
  domain: "clip";
  method: "list";
  mutating: false;
  path: "clip list";
  takesParams: true;
  ungated: false;
}, {
  capability: "clip.read";
  domain: "clip";
  method: "lyrics";
  mutating: false;
  path: "clip lyrics";
  takesParams: true;
  ungated: false;
}, {
  capability: "clip.write";
  domain: "clip";
  method: "moveEdges";
  mutating: true;
  path: "clip move-edges";
  takesParams: true;
  ungated: false;
}, {
  capability: "clip.read";
  domain: "clip";
  method: "noteContent";
  mutating: false;
  path: "clip note-content";
  takesParams: true;
  ungated: false;
}, {
  capability: "clip.write";
  domain: "clip";
  method: "replaceContent";
  mutating: true;
  path: "clip replace-content";
  takesParams: true;
  ungated: false;
}, {
  capability: "convert.editor-to-global";
  domain: "convert";
  method: "editorToGlobal";
  mutating: false;
  path: "convert editor-to-global";
  takesParams: true;
  ungated: true;
}, {
  capability: "convert.global-to-editor";
  domain: "convert";
  method: "globalToEditor";
  mutating: false;
  path: "convert global-to-editor";
  takesParams: true;
  ungated: true;
}, {
  capability: "convert.measure-to-tick";
  domain: "convert";
  method: "measureToTick";
  mutating: false;
  path: "convert measure-to-tick";
  takesParams: true;
  ungated: true;
}, {
  capability: "convert.tick-to-measure";
  domain: "convert";
  method: "tickToMeasure";
  mutating: false;
  path: "convert tick-to-measure";
  takesParams: true;
  ungated: true;
}, {
  capability: "convert.tick-to-time";
  domain: "convert";
  method: "tickToTime";
  mutating: false;
  path: "convert tick-to-time";
  takesParams: true;
  ungated: true;
}, {
  capability: "convert.time-to-tick";
  domain: "convert";
  method: "timeToTick";
  mutating: false;
  path: "convert time-to-tick";
  takesParams: true;
  ungated: true;
}, {
  capability: "device.read";
  domain: "device";
  method: "current";
  mutating: false;
  path: "device current";
  takesParams: false;
  ungated: false;
}, {
  capability: "device.read";
  domain: "device";
  method: "list";
  mutating: false;
  path: "device list";
  takesParams: false;
  ungated: false;
}, {
  capability: "editor.read";
  domain: "editor";
  method: "currentClip";
  mutating: false;
  path: "editor current-clip";
  takesParams: false;
  ungated: false;
}, {
  capability: "editor.write";
  domain: "editor";
  method: "open";
  mutating: true;
  path: "editor open";
  takesParams: false;
  ungated: false;
}, {
  capability: "editor.read";
  domain: "editor";
  method: "status";
  mutating: false;
  path: "editor status";
  takesParams: false;
  ungated: false;
}, {
  capability: "editor.read";
  domain: "editor";
  method: "tickRange";
  mutating: false;
  path: "editor tick-range";
  takesParams: false;
  ungated: false;
}, {
  capability: "job.control";
  domain: "job";
  method: "cancel";
  mutating: true;
  path: "job cancel";
  takesParams: true;
  ungated: false;
}, {
  capability: "job.control";
  domain: "job";
  method: "discardResult";
  mutating: true;
  path: "job discard-result";
  takesParams: true;
  ungated: false;
}, {
  capability: "job.read";
  domain: "job";
  method: "get";
  mutating: false;
  path: "job get";
  takesParams: true;
  ungated: false;
}, {
  capability: "job.read";
  domain: "job";
  method: "list";
  mutating: false;
  path: "job list";
  takesParams: true;
  ungated: false;
}, {
  capability: "clip.write";
  domain: "job";
  method: "place";
  mutating: true;
  path: "job place";
  takesParams: true;
  ungated: false;
}, {
  capability: "job.read";
  domain: "job";
  method: "results";
  mutating: false;
  path: "job results";
  takesParams: true;
  ungated: false;
}, {
  capability: "job.read";
  domain: "job";
  method: "wait";
  mutating: false;
  path: "job wait";
  takesParams: true;
  ungated: false;
}, {
  capability: "ui.view";
  domain: "mixer";
  method: "get";
  mutating: false;
  path: "mixer get";
  takesParams: false;
  ungated: false;
}, {
  capability: "ui.view";
  domain: "mixer";
  method: "hide";
  mutating: true;
  path: "mixer hide";
  takesParams: false;
  ungated: false;
}, {
  capability: "ui.view";
  domain: "mixer";
  method: "show";
  mutating: true;
  path: "mixer show";
  takesParams: false;
  ungated: false;
}, {
  capability: "note.write";
  domain: "note";
  method: "add";
  mutating: true;
  path: "note add";
  takesParams: true;
  ungated: false;
}, {
  capability: "note.write";
  domain: "note";
  method: "delete";
  mutating: true;
  path: "note delete";
  takesParams: true;
  ungated: false;
}, {
  capability: "note.write";
  domain: "note";
  method: "move";
  mutating: true;
  path: "note move";
  takesParams: true;
  ungated: false;
}, {
  capability: "note.write";
  domain: "note";
  method: "resize";
  mutating: true;
  path: "note resize";
  takesParams: true;
  ungated: false;
}, {
  capability: "note.write";
  domain: "note";
  method: "setLyric";
  mutating: true;
  path: "note set-lyric";
  takesParams: true;
  ungated: false;
}, {
  capability: "project.read";
  domain: "project";
  method: "info";
  mutating: false;
  path: "project info";
  takesParams: false;
  ungated: false;
}, {
  capability: "project.read";
  domain: "project";
  method: "synthesisStatus";
  mutating: false;
  path: "project synthesis-status";
  takesParams: false;
  ungated: false;
}, {
  capability: "selection.read";
  domain: "selection";
  method: "get";
  mutating: false;
  path: "selection get";
  takesParams: true;
  ungated: false;
}, {
  capability: "selection.write";
  domain: "selection";
  method: "set";
  mutating: true;
  path: "selection set";
  takesParams: true;
  ungated: false;
}, {
  capability: "ui.view";
  domain: "special-tracks";
  method: "get";
  mutating: false;
  path: "special-tracks get";
  takesParams: false;
  ungated: false;
}, {
  capability: "ui.view";
  domain: "special-tracks";
  method: "hide";
  mutating: true;
  path: "special-tracks hide";
  takesParams: true;
  ungated: false;
}, {
  capability: "ui.view";
  domain: "special-tracks";
  method: "show";
  mutating: true;
  path: "special-tracks show";
  takesParams: true;
  ungated: false;
}, {
  capability: "tempo.read";
  domain: "tempo";
  method: "get";
  mutating: false;
  path: "tempo get";
  takesParams: false;
  ungated: false;
}, {
  capability: "tempo.write";
  domain: "tempo";
  method: "set";
  mutating: true;
  path: "tempo set";
  takesParams: true;
  ungated: false;
}, {
  capability: "timesig.read";
  domain: "timesig";
  method: "get";
  mutating: false;
  path: "timesig get";
  takesParams: false;
  ungated: false;
}, {
  capability: "timesig.write";
  domain: "timesig";
  method: "set";
  mutating: true;
  path: "timesig set";
  takesParams: true;
  ungated: false;
}, {
  capability: "track.write";
  domain: "track";
  method: "delete";
  mutating: true;
  path: "track delete";
  takesParams: false;
  ungated: false;
}, {
  capability: "track.read";
  domain: "track";
  method: "get";
  mutating: false;
  path: "track get";
  takesParams: true;
  ungated: false;
}, {
  capability: "track.read";
  domain: "track";
  method: "list";
  mutating: false;
  path: "track list";
  takesParams: false;
  ungated: false;
}, {
  capability: "track.write";
  domain: "track";
  method: "rename";
  mutating: true;
  path: "track rename";
  takesParams: true;
  ungated: false;
}, {
  capability: "track.write";
  domain: "track";
  method: "set";
  mutating: true;
  path: "track set";
  takesParams: true;
  ungated: false;
}, {
  capability: "track.write";
  domain: "track";
  method: "setRecord";
  mutating: true;
  path: "track set-record";
  takesParams: true;
  ungated: false;
}, {
  capability: "track.read";
  domain: "track";
  method: "singerRecipe";
  mutating: false;
  path: "track singer-recipe";
  takesParams: true;
  ungated: false;
}, {
  capability: "transport.state";
  domain: "transport";
  method: "loop";
  mutating: false;
  path: "transport loop";
  takesParams: false;
  ungated: false;
}, {
  capability: "transport.control";
  domain: "transport";
  method: "metronome";
  mutating: true;
  path: "transport metronome";
  takesParams: true;
  ungated: false;
}, {
  capability: "transport.control";
  domain: "transport";
  method: "play";
  mutating: true;
  path: "transport play";
  takesParams: false;
  ungated: false;
}, {
  capability: "transport.control";
  domain: "transport";
  method: "seek";
  mutating: true;
  path: "transport seek";
  takesParams: true;
  ungated: false;
}, {
  capability: "transport.control";
  domain: "transport";
  method: "setLoop";
  mutating: true;
  path: "transport set-loop";
  takesParams: true;
  ungated: false;
}, {
  capability: "transport.state";
  domain: "transport";
  method: "state";
  mutating: false;
  path: "transport state";
  takesParams: false;
  ungated: false;
}, {
  capability: "transport.control";
  domain: "transport";
  method: "stop";
  mutating: true;
  path: "transport stop";
  takesParams: false;
  ungated: false;
}, {
  capability: "transport.control";
  domain: "transport";
  method: "toggle";
  mutating: true;
  path: "transport toggle";
  takesParams: false;
  ungated: false;
}, {
  capability: "voice.write";
  domain: "voice";
  method: "collect";
  mutating: true;
  path: "voice collect";
  takesParams: true;
  ungated: false;
}, {
  capability: "voice.read";
  domain: "voice";
  method: "communityList";
  mutating: false;
  path: "voice community-list";
  takesParams: true;
  ungated: false;
}, {
  capability: "voice.read";
  domain: "voice";
  method: "communityPages";
  mutating: false;
  path: "voice community-pages";
  takesParams: true;
  ungated: false;
}, {
  capability: "voice.read";
  domain: "voice";
  method: "list";
  mutating: false;
  path: "voice list";
  takesParams: true;
  ungated: false;
}, {
  capability: "voice.write";
  domain: "voice";
  method: "load";
  mutating: true;
  path: "voice load";
  takesParams: true;
  ungated: false;
}, {
  capability: "voice.read";
  domain: "voice";
  method: "tags";
  mutating: false;
  path: "voice tags";
  takesParams: true;
  ungated: false;
}, {
  capability: "voice.write";
  domain: "voice";
  method: "unload";
  mutating: true;
  path: "voice unload";
  takesParams: true;
  ungated: false;
}];
```

Every operation in this artifact, sorted by path.
