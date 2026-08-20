# Variable: PUBLIC\_SURFACE

```ts
const PUBLIC_SURFACE: {
  bulk: {
     params: {
     };
     result: {
     };
  };
  channels: readonly [{
     capability: "canvas.read";
     domain: "canvas";
     method: "onChanged";
     notification: "canvas.changed";
   }, {
     capability: "clip.read";
     domain: "clip";
     method: "onChanged";
     notification: "clips.changed";
   }, {
     capability: "job.read";
     domain: "job";
     method: "onChanged";
     notification: "jobs.changed";
   }, {
     capability: "project.read";
     domain: "project";
     method: "onChanged";
     notification: "project.changed";
   }, {
     capability: "selection.read";
     domain: "selection";
     method: "onChanged";
     notification: "selection.changed";
   }, {
     capability: "tempo.read";
     domain: "tempo";
     method: "onChanged";
     notification: "tempo.changed";
   }, {
     capability: "track.read";
     domain: "track";
     method: "onChanged";
     notification: "tracks.changed";
   }, {
     capability: "transport.state";
     domain: "transport";
     method: "onChanged";
     notification: "transport.changed";
   }, {
     capability: "ui.state";
     domain: "ui";
     method: "onChanged";
     notification: "ui.changed";
  }];
  fieldCapabilities: {
  };
  operations: readonly [{
     capability: "voice.write";
     domain: "blend";
     fingerprintPrecondition: false;
     method: "add";
     mutating: true;
     path: "blend add";
     takesParams: true;
     ungated: false;
   }, {
     capability: "voice.write";
     domain: "blend";
     fingerprintPrecondition: false;
     method: "create";
     mutating: true;
     path: "blend create";
     takesParams: true;
     ungated: false;
   }, {
     capability: "voice.write";
     domain: "blend";
     fingerprintPrecondition: false;
     method: "delete";
     mutating: true;
     path: "blend delete";
     takesParams: true;
     ungated: false;
   }, {
     capability: "voice.read";
     domain: "blend";
     fingerprintPrecondition: false;
     method: "get";
     mutating: false;
     path: "blend get";
     takesParams: true;
     ungated: false;
   }, {
     capability: "voice.read";
     domain: "blend";
     fingerprintPrecondition: false;
     method: "list";
     mutating: false;
     path: "blend list";
     takesParams: true;
     ungated: false;
   }, {
     capability: "voice.write";
     domain: "blend";
     fingerprintPrecondition: false;
     method: "remove";
     mutating: true;
     path: "blend remove";
     takesParams: true;
     ungated: false;
   }, {
     capability: "voice.write";
     domain: "blend";
     fingerprintPrecondition: false;
     method: "reorder";
     mutating: true;
     path: "blend reorder";
     takesParams: true;
     ungated: false;
   }, {
     capability: "voice.write";
     domain: "blend";
     fingerprintPrecondition: false;
     method: "set";
     mutating: true;
     path: "blend set";
     takesParams: true;
     ungated: false;
   }, {
     capability: "canvas.read";
     domain: "canvas";
     fingerprintPrecondition: false;
     method: "effectiveSize";
     mutating: false;
     path: "canvas effective-size";
     takesParams: false;
     ungated: false;
   }, {
     capability: "canvas.read";
     domain: "canvas";
     fingerprintPrecondition: false;
     method: "info";
     mutating: false;
     path: "canvas info";
     takesParams: false;
     ungated: false;
   }, {
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
     capability: "soundsource.write";
     domain: "choir";
     fingerprintPrecondition: false;
     method: "add";
     mutating: true;
     path: "choir add";
     takesParams: true;
     ungated: false;
   }, {
     capability: "soundsource.write";
     domain: "choir";
     fingerprintPrecondition: false;
     method: "disable";
     mutating: true;
     path: "choir disable";
     takesParams: true;
     ungated: false;
   }, {
     capability: "soundsource.write";
     domain: "choir";
     fingerprintPrecondition: false;
     method: "enable";
     mutating: true;
     path: "choir enable";
     takesParams: true;
     ungated: false;
   }, {
     capability: "soundsource.read";
     domain: "choir";
     fingerprintPrecondition: false;
     method: "get";
     mutating: false;
     path: "choir get";
     takesParams: true;
     ungated: false;
   }, {
     capability: "soundsource.write";
     domain: "choir";
     fingerprintPrecondition: false;
     method: "remove";
     mutating: true;
     path: "choir remove";
     takesParams: true;
     ungated: false;
   }, {
     capability: "soundsource.write";
     domain: "choir";
     fingerprintPrecondition: false;
     method: "reorder";
     mutating: true;
     path: "choir reorder";
     takesParams: true;
     ungated: false;
   }, {
     capability: "soundsource.write";
     domain: "choir";
     fingerprintPrecondition: false;
     method: "set";
     mutating: true;
     path: "choir set";
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
     method: "consolidate";
     mutating: true;
     path: "clip consolidate";
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
     capability: "clip.write";
     domain: "clip";
     fingerprintPrecondition: false;
     method: "delete";
     mutating: true;
     path: "clip delete";
     takesParams: true;
     ungated: false;
   }, {
     capability: "clip.write";
     domain: "clip";
     fingerprintPrecondition: false;
     method: "detachAudio";
     mutating: true;
     path: "clip detach-audio";
     takesParams: true;
     ungated: false;
   }, {
     capability: "clip.write";
     domain: "clip";
     fingerprintPrecondition: false;
     method: "duplicate";
     mutating: true;
     path: "clip duplicate";
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
     method: "move";
     mutating: true;
     path: "clip move";
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
     fingerprintPrecondition: false;
     method: "reattachAudio";
     mutating: true;
     path: "clip reattach-audio";
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
     capability: "clip.write";
     domain: "clip";
     fingerprintPrecondition: false;
     method: "resize";
     mutating: true;
     path: "clip resize";
     takesParams: true;
     ungated: false;
   }, {
     capability: "clip.write";
     domain: "clip";
     fingerprintPrecondition: false;
     method: "set";
     mutating: true;
     path: "clip set";
     takesParams: true;
     ungated: false;
   }, {
     capability: "clip.write";
     domain: "clip";
     fingerprintPrecondition: false;
     method: "setEnabled";
     mutating: true;
     path: "clip set-enabled";
     takesParams: true;
     ungated: false;
   }, {
     capability: "clip.write";
     domain: "clip";
     fingerprintPrecondition: false;
     method: "setFades";
     mutating: true;
     path: "clip set-fades";
     takesParams: true;
     ungated: false;
   }, {
     capability: "clip.write";
     domain: "clip";
     fingerprintPrecondition: false;
     method: "setGain";
     mutating: true;
     path: "clip set-gain";
     takesParams: true;
     ungated: false;
   }, {
     capability: "clip.write";
     domain: "clip";
     fingerprintPrecondition: false;
     method: "setMuted";
     mutating: true;
     path: "clip set-muted";
     takesParams: true;
     ungated: false;
   }, {
     capability: "clip.write";
     domain: "clip";
     fingerprintPrecondition: false;
     method: "split";
     mutating: true;
     path: "clip split";
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
     capability: "soundsource.write";
     domain: "ensemble";
     fingerprintPrecondition: false;
     method: "add";
     mutating: true;
     path: "ensemble add";
     takesParams: true;
     ungated: false;
   }, {
     capability: "soundsource.write";
     domain: "ensemble";
     fingerprintPrecondition: false;
     method: "disable";
     mutating: true;
     path: "ensemble disable";
     takesParams: true;
     ungated: false;
   }, {
     capability: "soundsource.write";
     domain: "ensemble";
     fingerprintPrecondition: false;
     method: "enable";
     mutating: true;
     path: "ensemble enable";
     takesParams: true;
     ungated: false;
   }, {
     capability: "soundsource.read";
     domain: "ensemble";
     fingerprintPrecondition: false;
     method: "get";
     mutating: false;
     path: "ensemble get";
     takesParams: true;
     ungated: false;
   }, {
     capability: "soundsource.write";
     domain: "ensemble";
     fingerprintPrecondition: false;
     method: "remove";
     mutating: true;
     path: "ensemble remove";
     takesParams: true;
     ungated: false;
   }, {
     capability: "soundsource.write";
     domain: "ensemble";
     fingerprintPrecondition: false;
     method: "reorder";
     mutating: true;
     path: "ensemble reorder";
     takesParams: true;
     ungated: false;
   }, {
     capability: "soundsource.write";
     domain: "ensemble";
     fingerprintPrecondition: false;
     method: "set";
     mutating: true;
     path: "ensemble set";
     takesParams: true;
     ungated: false;
   }, {
     capability: "export.invoke";
     domain: "export";
     fingerprintPrecondition: false;
     method: "audio";
     mutating: true;
     path: "export audio";
     takesParams: true;
     ungated: false;
   }, {
     capability: "export.invoke";
     domain: "export";
     fingerprintPrecondition: false;
     method: "fcpxml";
     mutating: true;
     path: "export fcpxml";
     takesParams: true;
     ungated: false;
   }, {
     capability: "export.invoke";
     domain: "export";
     fingerprintPrecondition: false;
     method: "lrc";
     mutating: true;
     path: "export lrc";
     takesParams: true;
     ungated: false;
   }, {
     capability: "export.invoke";
     domain: "export";
     fingerprintPrecondition: false;
     method: "midi";
     mutating: true;
     path: "export midi";
     takesParams: true;
     ungated: false;
   }, {
     capability: "export.invoke";
     domain: "export";
     entitlement: "membership";
     fingerprintPrecondition: false;
     method: "songTemplate";
     mutating: true;
     path: "export song-template";
     takesParams: true;
     ungated: false;
   }, {
     capability: "export.invoke";
     domain: "export";
     fingerprintPrecondition: false;
     method: "video";
     mutating: true;
     path: "export video";
     takesParams: true;
     ungated: false;
   }, {
     capability: "export.invoke";
     domain: "export";
     entitlement: "membership";
     fingerprintPrecondition: false;
     method: "vocalSample";
     mutating: true;
     path: "export vocal-sample";
     takesParams: true;
     ungated: false;
   }, {
     capability: "fx.write";
     domain: "fx";
     fingerprintPrecondition: false;
     method: "add";
     mutating: true;
     path: "fx add";
     takesParams: true;
     ungated: false;
   }, {
     capability: "fx.write";
     domain: "fx";
     fingerprintPrecondition: true;
     method: "applyPreset";
     mutating: true;
     path: "fx apply-preset";
     takesParams: true;
     ungated: false;
   }, {
     capability: "fx.read";
     domain: "fx";
     fingerprintPrecondition: false;
     method: "getParams";
     mutating: false;
     path: "fx get-params";
     takesParams: true;
     ungated: false;
   }, {
     capability: "fx.read";
     domain: "fx";
     fingerprintPrecondition: false;
     method: "list";
     mutating: false;
     path: "fx list";
     takesParams: true;
     ungated: false;
   }, {
     capability: "fx.read";
     domain: "fx";
     fingerprintPrecondition: false;
     method: "listAvailable";
     mutating: false;
     path: "fx list-available";
     takesParams: true;
     ungated: false;
   }, {
     capability: "fx.read";
     domain: "fx";
     fingerprintPrecondition: false;
     method: "listParams";
     mutating: false;
     path: "fx list-params";
     takesParams: true;
     ungated: false;
   }, {
     capability: "ui.control";
     domain: "fx";
     fingerprintPrecondition: false;
     method: "openEditor";
     mutating: true;
     path: "fx open-editor";
     takesParams: true;
     ungated: false;
   }, {
     capability: "fx.write";
     domain: "fx";
     fingerprintPrecondition: false;
     method: "remove";
     mutating: true;
     path: "fx remove";
     takesParams: true;
     ungated: false;
   }, {
     capability: "fx.write";
     domain: "fx";
     fingerprintPrecondition: false;
     method: "reorder";
     mutating: true;
     path: "fx reorder";
     takesParams: true;
     ungated: false;
   }, {
     capability: "fx.write";
     domain: "fx";
     fingerprintPrecondition: false;
     method: "savePreset";
     mutating: true;
     path: "fx save-preset";
     takesParams: true;
     ungated: false;
   }, {
     capability: "fx.write";
     domain: "fx";
     fingerprintPrecondition: false;
     method: "scan";
     mutating: true;
     path: "fx scan";
     takesParams: true;
     ungated: false;
   }, {
     capability: "fx.write";
     domain: "fx";
     fingerprintPrecondition: false;
     method: "set";
     mutating: true;
     path: "fx set";
     takesParams: true;
     ungated: false;
   }, {
     capability: "fx.write";
     domain: "fx";
     fingerprintPrecondition: true;
     method: "setParam";
     mutating: true;
     path: "fx set-param";
     takesParams: true;
     ungated: false;
   }, {
     capability: "fx.write";
     domain: "fx";
     fingerprintPrecondition: false;
     method: "setRoom";
     mutating: true;
     path: "fx set-room";
     takesParams: true;
     ungated: false;
   }, {
     capability: "generative.add-layer";
     domain: "generative";
     entitlement: "credits(add-a-layer)";
     fingerprintPrecondition: false;
     method: "addLayer";
     mutating: true;
     path: "generative add-layer";
     takesParams: true;
     ungated: false;
   }, {
     capability: "generative.enhance";
     domain: "generative";
     entitlement: "credits(music-enhancer)";
     fingerprintPrecondition: false;
     method: "enhance";
     mutating: true;
     path: "generative enhance";
     takesParams: true;
     ungated: false;
   }, {
     capability: "generative.seed-audio";
     domain: "generative";
     entitlement: "credits(seed-audio)";
     fingerprintPrecondition: false;
     method: "seedAudio";
     mutating: true;
     path: "generative seed-audio";
     takesParams: true;
     ungated: false;
   }, {
     capability: "generative.song";
     domain: "generative";
     entitlement: "credits(song-generator)";
     fingerprintPrecondition: false;
     method: "song";
     mutating: true;
     path: "generative song";
     takesParams: true;
     ungated: false;
   }, {
     capability: "generative.sound-effects";
     domain: "generative";
     entitlement: "credits(sound-effects)";
     fingerprintPrecondition: false;
     method: "soundEffects";
     mutating: true;
     path: "generative sound-effects";
     takesParams: true;
     ungated: false;
   }, {
     capability: "generative.stem-split";
     domain: "generative";
     entitlement: "credits(stem-splitter)";
     fingerprintPrecondition: false;
     method: "stemSplit";
     mutating: true;
     path: "generative stem-split";
     takesParams: true;
     ungated: false;
   }, {
     capability: "generative.text2sample";
     domain: "generative";
     entitlement: "credits(text2sample)";
     fingerprintPrecondition: false;
     method: "text2sample";
     mutating: true;
     path: "generative text2sample";
     takesParams: true;
     ungated: false;
   }, {
     capability: "generative.vocal2midi";
     domain: "generative";
     fingerprintPrecondition: false;
     method: "vocal2midi";
     mutating: true;
     path: "generative vocal2midi";
     takesParams: true;
     ungated: false;
   }, {
     capability: "generative.voice-change";
     domain: "generative";
     fingerprintPrecondition: false;
     method: "voiceChange";
     mutating: true;
     path: "generative voice-change";
     takesParams: true;
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
     capability: "import.invoke";
     domain: "import";
     fingerprintPrecondition: false;
     method: "file";
     mutating: true;
     path: "import file";
     takesParams: true;
     ungated: false;
   }, {
     capability: "soundsource.write";
     domain: "instrument";
     fingerprintPrecondition: false;
     method: "disable";
     mutating: true;
     path: "instrument disable";
     takesParams: true;
     ungated: false;
   }, {
     capability: "soundsource.write";
     domain: "instrument";
     fingerprintPrecondition: false;
     method: "enable";
     mutating: true;
     path: "instrument enable";
     takesParams: true;
     ungated: false;
   }, {
     capability: "soundsource.write";
     domain: "instrument";
     fingerprintPrecondition: false;
     method: "set";
     mutating: true;
     path: "instrument set";
     takesParams: true;
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
     capability: "note.read";
     domain: "note";
     fingerprintPrecondition: false;
     method: "get";
     mutating: false;
     path: "note get";
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
     method: "setArticulation";
     mutating: true;
     path: "note set-articulation";
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
     capability: "note.write";
     domain: "note";
     fingerprintPrecondition: true;
     method: "split";
     mutating: true;
     path: "note split";
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
     capability: "soundsource.read";
     domain: "sound-source";
     fingerprintPrecondition: false;
     method: "get";
     mutating: false;
     path: "sound-source get";
     takesParams: true;
     ungated: false;
   }, {
     capability: "soundsource.read";
     domain: "sound-source";
     fingerprintPrecondition: false;
     method: "list";
     mutating: false;
     path: "sound-source list";
     takesParams: true;
     ungated: false;
   }, {
     capability: "soundsource.write";
     domain: "sound-source";
     fingerprintPrecondition: false;
     method: "load";
     mutating: true;
     path: "sound-source load";
     takesParams: true;
     ungated: false;
   }, {
     capability: "soundsource.write";
     domain: "sound-source";
     fingerprintPrecondition: false;
     method: "set";
     mutating: true;
     path: "sound-source set";
     takesParams: true;
     ungated: false;
   }, {
     capability: "soundsource.read";
     domain: "sound-source";
     fingerprintPrecondition: false;
     method: "tags";
     mutating: false;
     path: "sound-source tags";
     takesParams: true;
     ungated: false;
   }, {
     capability: "soundsource.write";
     domain: "sound-source";
     fingerprintPrecondition: false;
     method: "unload";
     mutating: true;
     path: "sound-source unload";
     takesParams: true;
     ungated: false;
   }, {
     capability: "tempo.analyze";
     domain: "tempo";
     fingerprintPrecondition: false;
     method: "analyze";
     mutating: true;
     path: "tempo analyze";
     takesParams: true;
     ungated: false;
   }, {
     capability: "tempo.applyV2";
     domain: "tempo";
     fingerprintPrecondition: false;
     method: "applyBeatAnalysis";
     mutating: true;
     path: "tempo apply-beat-analysis";
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
     capability: "tempo.read";
     domain: "tempo";
     fingerprintPrecondition: false;
     method: "points";
     mutating: false;
     path: "tempo points";
     takesParams: false;
     ungated: false;
   }, {
     capability: "tempo.write";
     domain: "tempo";
     fingerprintPrecondition: true;
     method: "removePoint";
     mutating: true;
     path: "tempo remove-point";
     takesParams: true;
     ungated: false;
   }, {
     capability: "tempo.write";
     domain: "tempo";
     fingerprintPrecondition: true;
     method: "set";
     mutating: true;
     path: "tempo set";
     takesParams: true;
     ungated: false;
   }, {
     capability: "tempo.write";
     domain: "tempo";
     fingerprintPrecondition: false;
     method: "setDisplayRange";
     mutating: true;
     path: "tempo set-display-range";
     takesParams: true;
     ungated: false;
   }, {
     capability: "tempo.write";
     domain: "tempo";
     fingerprintPrecondition: true;
     method: "setPoint";
     mutating: true;
     path: "tempo set-point";
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
     capability: "timesig.read";
     domain: "timesig";
     fingerprintPrecondition: false;
     method: "list";
     mutating: false;
     path: "timesig list";
     takesParams: false;
     ungated: false;
   }, {
     capability: "timesig.write";
     domain: "timesig";
     fingerprintPrecondition: true;
     method: "removeAt";
     mutating: true;
     path: "timesig remove-at";
     takesParams: true;
     ungated: false;
   }, {
     capability: "timesig.write";
     domain: "timesig";
     fingerprintPrecondition: true;
     method: "set";
     mutating: true;
     path: "timesig set";
     takesParams: true;
     ungated: false;
   }, {
     capability: "timesig.write";
     domain: "timesig";
     fingerprintPrecondition: true;
     method: "setAt";
     mutating: true;
     path: "timesig set-at";
     takesParams: true;
     ungated: false;
   }, {
     capability: "track.write";
     domain: "track";
     fingerprintPrecondition: false;
     method: "create";
     mutating: true;
     path: "track create";
     takesParams: true;
     ungated: false;
   }, {
     capability: "track.write";
     domain: "track";
     fingerprintPrecondition: false;
     method: "delete";
     mutating: true;
     path: "track delete";
     takesParams: true;
     ungated: false;
   }, {
     capability: "track.write";
     domain: "track";
     fingerprintPrecondition: false;
     method: "duplicate";
     mutating: true;
     path: "track duplicate";
     takesParams: true;
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
     takesParams: true;
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
     method: "reorder";
     mutating: true;
     path: "track reorder";
     takesParams: true;
     ungated: false;
   }, {
     capability: "track.read";
     domain: "track";
     fingerprintPrecondition: false;
     method: "resolve";
     mutating: false;
     path: "track resolve";
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
     method: "setInput";
     mutating: true;
     path: "track set-input";
     takesParams: true;
     ungated: false;
   }, {
     capability: "track.write";
     domain: "track";
     fingerprintPrecondition: false;
     method: "setLanguage";
     mutating: true;
     path: "track set-language";
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
     capability: "vocalparam.read";
     domain: "vocalparam";
     fingerprintPrecondition: false;
     method: "read";
     mutating: false;
     path: "vocalparam read";
     takesParams: true;
     ungated: false;
   }, {
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
     method: "community";
     mutating: false;
     path: "voice community";
     takesParams: true;
     ungated: false;
   }, {
     capability: "voice.read";
     domain: "voice";
     fingerprintPrecondition: false;
     method: "seeds";
     mutating: false;
     path: "voice seeds";
     takesParams: true;
     ungated: false;
   }, {
     capability: "voice.read";
     domain: "voice";
     fingerprintPrecondition: false;
     method: "synthModels";
     mutating: false;
     path: "voice synth-models";
     takesParams: true;
     ungated: false;
  }];
  requiredTokens: {
     blend add: "voice.write";
     blend create: "voice.write";
     blend delete: "voice.write";
     blend get: "voice.read";
     blend list: "voice.read";
     blend remove: "voice.write";
     blend reorder: "voice.write";
     blend set: "voice.write";
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
     clip audio-content: "clip.read";
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
     export fcpxml: "export.invoke";
     export lrc: "export.invoke";
     export midi: "export.invoke";
     export song-template: "export.invoke";
     export video: "export.invoke";
     export vocal-sample: "export.invoke";
     fx add: "fx.write";
     fx apply-preset: "fx.write";
     fx get-params: "fx.read";
     fx list: "fx.read";
     fx list-available: "fx.read";
     fx list-params: "fx.read";
     fx open-editor: "ui.control";
     fx remove: "fx.write";
     fx reorder: "fx.write";
     fx save-preset: "fx.write";
     fx scan: "fx.write";
     fx set: "fx.write";
     fx set-param: "fx.write";
     fx set-room: "fx.write";
     generative add-layer: "generative.add-layer";
     generative enhance: "generative.enhance";
     generative seed-audio: "generative.seed-audio";
     generative song: "generative.song";
     generative sound-effects: "generative.sound-effects";
     generative stem-split: "generative.stem-split";
     generative text2sample: "generative.text2sample";
     generative vocal2midi: "generative.vocal2midi";
     generative voice-change: "generative.voice-change";
     history list: "history.read";
     history redo: "history.control";
     history undo: "history.control";
     import file: "import.invoke";
     instrument disable: "soundsource.write";
     instrument enable: "soundsource.write";
     instrument set: "soundsource.write";
     job cancel: "job.control";
     job discard-result: "job.control";
     job get: "job.read";
     job list: "job.read";
     job place: "clip.write";
     job results: "job.read";
     job wait: "job.read";
     note add: "note.write";
     note delete: "note.write";
     note get: "note.read";
     note move: "note.write";
     note resize: "note.write";
     note set-articulation: "note.write";
     note set-lyric: "note.write";
     note split: "note.write";
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
     vocalparam write: "vocalparam.write";
     voice collect: "voice.write";
     voice community: "voice.read";
     voice seeds: "voice.read";
     voice synth-models: "voice.read";
  };
  tokens: readonly ["canvas.read", "caret.read", "caret.write", "chord.read", "chord.write", "clip.read", "clip.write", "device.read", "device.write", "editor.read", "editor.write", "export.invoke", "fx.read", "fx.write", "generative.add-layer", "generative.enhance", "generative.seed-audio", "generative.song", "generative.sound-effects", "generative.stem-split", "generative.text2sample", "generative.vocal2midi", "generative.voice-change", "history.control", "history.read", "import.invoke", "job.control", "job.read", "lyric.read", "lyric.write", "note.read", "note.write", "project.lifecycle", "project.read", "recording.control", "selection.read", "selection.write", "session.handshake", "session.move", "session.ping", "session.shutdown", "soundsource.read", "soundsource.write", "tempo.analyze", "tempo.applyV2", "tempo.read", "tempo.write", "timesig.read", "timesig.write", "track.read", "track.write", "transport.control", "transport.state", "ui.control", "ui.state", "vocalparam.read", "vocalparam.write", "voice.read", "voice.write", "workflow.dev", "workflow.ui"];
};
```

Everything the binding runtime needs to build this artifact's client. Pass it to `connect` as the driver's surface; the public one is that call's default, so a consumer of the published set alone never names it.

## Type Declaration

### bulk

```ts
readonly bulk: {
  params: {
  };
  result: {
  };
};
```

#### bulk.params

```ts
readonly params: {
} = BULK_PARAM_FIELDS;
```

#### bulk.result

```ts
readonly result: {
} = BULK_RESULT_FIELDS;
```

### channels

```ts
readonly channels: readonly [{
  capability: "canvas.read";
  domain: "canvas";
  method: "onChanged";
  notification: "canvas.changed";
}, {
  capability: "clip.read";
  domain: "clip";
  method: "onChanged";
  notification: "clips.changed";
}, {
  capability: "job.read";
  domain: "job";
  method: "onChanged";
  notification: "jobs.changed";
}, {
  capability: "project.read";
  domain: "project";
  method: "onChanged";
  notification: "project.changed";
}, {
  capability: "selection.read";
  domain: "selection";
  method: "onChanged";
  notification: "selection.changed";
}, {
  capability: "tempo.read";
  domain: "tempo";
  method: "onChanged";
  notification: "tempo.changed";
}, {
  capability: "track.read";
  domain: "track";
  method: "onChanged";
  notification: "tracks.changed";
}, {
  capability: "transport.state";
  domain: "transport";
  method: "onChanged";
  notification: "transport.changed";
}, {
  capability: "ui.state";
  domain: "ui";
  method: "onChanged";
  notification: "ui.changed";
}] = NOTIFICATION_CHANNELS;
```

### fieldCapabilities

```ts
readonly fieldCapabilities: {
} = FIELD_CAPABILITIES;
```

### operations

```ts
readonly operations: readonly [{
  capability: "voice.write";
  domain: "blend";
  fingerprintPrecondition: false;
  method: "add";
  mutating: true;
  path: "blend add";
  takesParams: true;
  ungated: false;
}, {
  capability: "voice.write";
  domain: "blend";
  fingerprintPrecondition: false;
  method: "create";
  mutating: true;
  path: "blend create";
  takesParams: true;
  ungated: false;
}, {
  capability: "voice.write";
  domain: "blend";
  fingerprintPrecondition: false;
  method: "delete";
  mutating: true;
  path: "blend delete";
  takesParams: true;
  ungated: false;
}, {
  capability: "voice.read";
  domain: "blend";
  fingerprintPrecondition: false;
  method: "get";
  mutating: false;
  path: "blend get";
  takesParams: true;
  ungated: false;
}, {
  capability: "voice.read";
  domain: "blend";
  fingerprintPrecondition: false;
  method: "list";
  mutating: false;
  path: "blend list";
  takesParams: true;
  ungated: false;
}, {
  capability: "voice.write";
  domain: "blend";
  fingerprintPrecondition: false;
  method: "remove";
  mutating: true;
  path: "blend remove";
  takesParams: true;
  ungated: false;
}, {
  capability: "voice.write";
  domain: "blend";
  fingerprintPrecondition: false;
  method: "reorder";
  mutating: true;
  path: "blend reorder";
  takesParams: true;
  ungated: false;
}, {
  capability: "voice.write";
  domain: "blend";
  fingerprintPrecondition: false;
  method: "set";
  mutating: true;
  path: "blend set";
  takesParams: true;
  ungated: false;
}, {
  capability: "canvas.read";
  domain: "canvas";
  fingerprintPrecondition: false;
  method: "effectiveSize";
  mutating: false;
  path: "canvas effective-size";
  takesParams: false;
  ungated: false;
}, {
  capability: "canvas.read";
  domain: "canvas";
  fingerprintPrecondition: false;
  method: "info";
  mutating: false;
  path: "canvas info";
  takesParams: false;
  ungated: false;
}, {
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
  capability: "soundsource.write";
  domain: "choir";
  fingerprintPrecondition: false;
  method: "add";
  mutating: true;
  path: "choir add";
  takesParams: true;
  ungated: false;
}, {
  capability: "soundsource.write";
  domain: "choir";
  fingerprintPrecondition: false;
  method: "disable";
  mutating: true;
  path: "choir disable";
  takesParams: true;
  ungated: false;
}, {
  capability: "soundsource.write";
  domain: "choir";
  fingerprintPrecondition: false;
  method: "enable";
  mutating: true;
  path: "choir enable";
  takesParams: true;
  ungated: false;
}, {
  capability: "soundsource.read";
  domain: "choir";
  fingerprintPrecondition: false;
  method: "get";
  mutating: false;
  path: "choir get";
  takesParams: true;
  ungated: false;
}, {
  capability: "soundsource.write";
  domain: "choir";
  fingerprintPrecondition: false;
  method: "remove";
  mutating: true;
  path: "choir remove";
  takesParams: true;
  ungated: false;
}, {
  capability: "soundsource.write";
  domain: "choir";
  fingerprintPrecondition: false;
  method: "reorder";
  mutating: true;
  path: "choir reorder";
  takesParams: true;
  ungated: false;
}, {
  capability: "soundsource.write";
  domain: "choir";
  fingerprintPrecondition: false;
  method: "set";
  mutating: true;
  path: "choir set";
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
  method: "consolidate";
  mutating: true;
  path: "clip consolidate";
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
  capability: "clip.write";
  domain: "clip";
  fingerprintPrecondition: false;
  method: "delete";
  mutating: true;
  path: "clip delete";
  takesParams: true;
  ungated: false;
}, {
  capability: "clip.write";
  domain: "clip";
  fingerprintPrecondition: false;
  method: "detachAudio";
  mutating: true;
  path: "clip detach-audio";
  takesParams: true;
  ungated: false;
}, {
  capability: "clip.write";
  domain: "clip";
  fingerprintPrecondition: false;
  method: "duplicate";
  mutating: true;
  path: "clip duplicate";
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
  method: "move";
  mutating: true;
  path: "clip move";
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
  fingerprintPrecondition: false;
  method: "reattachAudio";
  mutating: true;
  path: "clip reattach-audio";
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
  capability: "clip.write";
  domain: "clip";
  fingerprintPrecondition: false;
  method: "resize";
  mutating: true;
  path: "clip resize";
  takesParams: true;
  ungated: false;
}, {
  capability: "clip.write";
  domain: "clip";
  fingerprintPrecondition: false;
  method: "set";
  mutating: true;
  path: "clip set";
  takesParams: true;
  ungated: false;
}, {
  capability: "clip.write";
  domain: "clip";
  fingerprintPrecondition: false;
  method: "setEnabled";
  mutating: true;
  path: "clip set-enabled";
  takesParams: true;
  ungated: false;
}, {
  capability: "clip.write";
  domain: "clip";
  fingerprintPrecondition: false;
  method: "setFades";
  mutating: true;
  path: "clip set-fades";
  takesParams: true;
  ungated: false;
}, {
  capability: "clip.write";
  domain: "clip";
  fingerprintPrecondition: false;
  method: "setGain";
  mutating: true;
  path: "clip set-gain";
  takesParams: true;
  ungated: false;
}, {
  capability: "clip.write";
  domain: "clip";
  fingerprintPrecondition: false;
  method: "setMuted";
  mutating: true;
  path: "clip set-muted";
  takesParams: true;
  ungated: false;
}, {
  capability: "clip.write";
  domain: "clip";
  fingerprintPrecondition: false;
  method: "split";
  mutating: true;
  path: "clip split";
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
  capability: "soundsource.write";
  domain: "ensemble";
  fingerprintPrecondition: false;
  method: "add";
  mutating: true;
  path: "ensemble add";
  takesParams: true;
  ungated: false;
}, {
  capability: "soundsource.write";
  domain: "ensemble";
  fingerprintPrecondition: false;
  method: "disable";
  mutating: true;
  path: "ensemble disable";
  takesParams: true;
  ungated: false;
}, {
  capability: "soundsource.write";
  domain: "ensemble";
  fingerprintPrecondition: false;
  method: "enable";
  mutating: true;
  path: "ensemble enable";
  takesParams: true;
  ungated: false;
}, {
  capability: "soundsource.read";
  domain: "ensemble";
  fingerprintPrecondition: false;
  method: "get";
  mutating: false;
  path: "ensemble get";
  takesParams: true;
  ungated: false;
}, {
  capability: "soundsource.write";
  domain: "ensemble";
  fingerprintPrecondition: false;
  method: "remove";
  mutating: true;
  path: "ensemble remove";
  takesParams: true;
  ungated: false;
}, {
  capability: "soundsource.write";
  domain: "ensemble";
  fingerprintPrecondition: false;
  method: "reorder";
  mutating: true;
  path: "ensemble reorder";
  takesParams: true;
  ungated: false;
}, {
  capability: "soundsource.write";
  domain: "ensemble";
  fingerprintPrecondition: false;
  method: "set";
  mutating: true;
  path: "ensemble set";
  takesParams: true;
  ungated: false;
}, {
  capability: "export.invoke";
  domain: "export";
  fingerprintPrecondition: false;
  method: "audio";
  mutating: true;
  path: "export audio";
  takesParams: true;
  ungated: false;
}, {
  capability: "export.invoke";
  domain: "export";
  fingerprintPrecondition: false;
  method: "fcpxml";
  mutating: true;
  path: "export fcpxml";
  takesParams: true;
  ungated: false;
}, {
  capability: "export.invoke";
  domain: "export";
  fingerprintPrecondition: false;
  method: "lrc";
  mutating: true;
  path: "export lrc";
  takesParams: true;
  ungated: false;
}, {
  capability: "export.invoke";
  domain: "export";
  fingerprintPrecondition: false;
  method: "midi";
  mutating: true;
  path: "export midi";
  takesParams: true;
  ungated: false;
}, {
  capability: "export.invoke";
  domain: "export";
  entitlement: "membership";
  fingerprintPrecondition: false;
  method: "songTemplate";
  mutating: true;
  path: "export song-template";
  takesParams: true;
  ungated: false;
}, {
  capability: "export.invoke";
  domain: "export";
  fingerprintPrecondition: false;
  method: "video";
  mutating: true;
  path: "export video";
  takesParams: true;
  ungated: false;
}, {
  capability: "export.invoke";
  domain: "export";
  entitlement: "membership";
  fingerprintPrecondition: false;
  method: "vocalSample";
  mutating: true;
  path: "export vocal-sample";
  takesParams: true;
  ungated: false;
}, {
  capability: "fx.write";
  domain: "fx";
  fingerprintPrecondition: false;
  method: "add";
  mutating: true;
  path: "fx add";
  takesParams: true;
  ungated: false;
}, {
  capability: "fx.write";
  domain: "fx";
  fingerprintPrecondition: true;
  method: "applyPreset";
  mutating: true;
  path: "fx apply-preset";
  takesParams: true;
  ungated: false;
}, {
  capability: "fx.read";
  domain: "fx";
  fingerprintPrecondition: false;
  method: "getParams";
  mutating: false;
  path: "fx get-params";
  takesParams: true;
  ungated: false;
}, {
  capability: "fx.read";
  domain: "fx";
  fingerprintPrecondition: false;
  method: "list";
  mutating: false;
  path: "fx list";
  takesParams: true;
  ungated: false;
}, {
  capability: "fx.read";
  domain: "fx";
  fingerprintPrecondition: false;
  method: "listAvailable";
  mutating: false;
  path: "fx list-available";
  takesParams: true;
  ungated: false;
}, {
  capability: "fx.read";
  domain: "fx";
  fingerprintPrecondition: false;
  method: "listParams";
  mutating: false;
  path: "fx list-params";
  takesParams: true;
  ungated: false;
}, {
  capability: "ui.control";
  domain: "fx";
  fingerprintPrecondition: false;
  method: "openEditor";
  mutating: true;
  path: "fx open-editor";
  takesParams: true;
  ungated: false;
}, {
  capability: "fx.write";
  domain: "fx";
  fingerprintPrecondition: false;
  method: "remove";
  mutating: true;
  path: "fx remove";
  takesParams: true;
  ungated: false;
}, {
  capability: "fx.write";
  domain: "fx";
  fingerprintPrecondition: false;
  method: "reorder";
  mutating: true;
  path: "fx reorder";
  takesParams: true;
  ungated: false;
}, {
  capability: "fx.write";
  domain: "fx";
  fingerprintPrecondition: false;
  method: "savePreset";
  mutating: true;
  path: "fx save-preset";
  takesParams: true;
  ungated: false;
}, {
  capability: "fx.write";
  domain: "fx";
  fingerprintPrecondition: false;
  method: "scan";
  mutating: true;
  path: "fx scan";
  takesParams: true;
  ungated: false;
}, {
  capability: "fx.write";
  domain: "fx";
  fingerprintPrecondition: false;
  method: "set";
  mutating: true;
  path: "fx set";
  takesParams: true;
  ungated: false;
}, {
  capability: "fx.write";
  domain: "fx";
  fingerprintPrecondition: true;
  method: "setParam";
  mutating: true;
  path: "fx set-param";
  takesParams: true;
  ungated: false;
}, {
  capability: "fx.write";
  domain: "fx";
  fingerprintPrecondition: false;
  method: "setRoom";
  mutating: true;
  path: "fx set-room";
  takesParams: true;
  ungated: false;
}, {
  capability: "generative.add-layer";
  domain: "generative";
  entitlement: "credits(add-a-layer)";
  fingerprintPrecondition: false;
  method: "addLayer";
  mutating: true;
  path: "generative add-layer";
  takesParams: true;
  ungated: false;
}, {
  capability: "generative.enhance";
  domain: "generative";
  entitlement: "credits(music-enhancer)";
  fingerprintPrecondition: false;
  method: "enhance";
  mutating: true;
  path: "generative enhance";
  takesParams: true;
  ungated: false;
}, {
  capability: "generative.seed-audio";
  domain: "generative";
  entitlement: "credits(seed-audio)";
  fingerprintPrecondition: false;
  method: "seedAudio";
  mutating: true;
  path: "generative seed-audio";
  takesParams: true;
  ungated: false;
}, {
  capability: "generative.song";
  domain: "generative";
  entitlement: "credits(song-generator)";
  fingerprintPrecondition: false;
  method: "song";
  mutating: true;
  path: "generative song";
  takesParams: true;
  ungated: false;
}, {
  capability: "generative.sound-effects";
  domain: "generative";
  entitlement: "credits(sound-effects)";
  fingerprintPrecondition: false;
  method: "soundEffects";
  mutating: true;
  path: "generative sound-effects";
  takesParams: true;
  ungated: false;
}, {
  capability: "generative.stem-split";
  domain: "generative";
  entitlement: "credits(stem-splitter)";
  fingerprintPrecondition: false;
  method: "stemSplit";
  mutating: true;
  path: "generative stem-split";
  takesParams: true;
  ungated: false;
}, {
  capability: "generative.text2sample";
  domain: "generative";
  entitlement: "credits(text2sample)";
  fingerprintPrecondition: false;
  method: "text2sample";
  mutating: true;
  path: "generative text2sample";
  takesParams: true;
  ungated: false;
}, {
  capability: "generative.vocal2midi";
  domain: "generative";
  fingerprintPrecondition: false;
  method: "vocal2midi";
  mutating: true;
  path: "generative vocal2midi";
  takesParams: true;
  ungated: false;
}, {
  capability: "generative.voice-change";
  domain: "generative";
  fingerprintPrecondition: false;
  method: "voiceChange";
  mutating: true;
  path: "generative voice-change";
  takesParams: true;
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
  capability: "import.invoke";
  domain: "import";
  fingerprintPrecondition: false;
  method: "file";
  mutating: true;
  path: "import file";
  takesParams: true;
  ungated: false;
}, {
  capability: "soundsource.write";
  domain: "instrument";
  fingerprintPrecondition: false;
  method: "disable";
  mutating: true;
  path: "instrument disable";
  takesParams: true;
  ungated: false;
}, {
  capability: "soundsource.write";
  domain: "instrument";
  fingerprintPrecondition: false;
  method: "enable";
  mutating: true;
  path: "instrument enable";
  takesParams: true;
  ungated: false;
}, {
  capability: "soundsource.write";
  domain: "instrument";
  fingerprintPrecondition: false;
  method: "set";
  mutating: true;
  path: "instrument set";
  takesParams: true;
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
  capability: "note.read";
  domain: "note";
  fingerprintPrecondition: false;
  method: "get";
  mutating: false;
  path: "note get";
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
  method: "setArticulation";
  mutating: true;
  path: "note set-articulation";
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
  capability: "note.write";
  domain: "note";
  fingerprintPrecondition: true;
  method: "split";
  mutating: true;
  path: "note split";
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
  capability: "soundsource.read";
  domain: "sound-source";
  fingerprintPrecondition: false;
  method: "get";
  mutating: false;
  path: "sound-source get";
  takesParams: true;
  ungated: false;
}, {
  capability: "soundsource.read";
  domain: "sound-source";
  fingerprintPrecondition: false;
  method: "list";
  mutating: false;
  path: "sound-source list";
  takesParams: true;
  ungated: false;
}, {
  capability: "soundsource.write";
  domain: "sound-source";
  fingerprintPrecondition: false;
  method: "load";
  mutating: true;
  path: "sound-source load";
  takesParams: true;
  ungated: false;
}, {
  capability: "soundsource.write";
  domain: "sound-source";
  fingerprintPrecondition: false;
  method: "set";
  mutating: true;
  path: "sound-source set";
  takesParams: true;
  ungated: false;
}, {
  capability: "soundsource.read";
  domain: "sound-source";
  fingerprintPrecondition: false;
  method: "tags";
  mutating: false;
  path: "sound-source tags";
  takesParams: true;
  ungated: false;
}, {
  capability: "soundsource.write";
  domain: "sound-source";
  fingerprintPrecondition: false;
  method: "unload";
  mutating: true;
  path: "sound-source unload";
  takesParams: true;
  ungated: false;
}, {
  capability: "tempo.analyze";
  domain: "tempo";
  fingerprintPrecondition: false;
  method: "analyze";
  mutating: true;
  path: "tempo analyze";
  takesParams: true;
  ungated: false;
}, {
  capability: "tempo.applyV2";
  domain: "tempo";
  fingerprintPrecondition: false;
  method: "applyBeatAnalysis";
  mutating: true;
  path: "tempo apply-beat-analysis";
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
  capability: "tempo.read";
  domain: "tempo";
  fingerprintPrecondition: false;
  method: "points";
  mutating: false;
  path: "tempo points";
  takesParams: false;
  ungated: false;
}, {
  capability: "tempo.write";
  domain: "tempo";
  fingerprintPrecondition: true;
  method: "removePoint";
  mutating: true;
  path: "tempo remove-point";
  takesParams: true;
  ungated: false;
}, {
  capability: "tempo.write";
  domain: "tempo";
  fingerprintPrecondition: true;
  method: "set";
  mutating: true;
  path: "tempo set";
  takesParams: true;
  ungated: false;
}, {
  capability: "tempo.write";
  domain: "tempo";
  fingerprintPrecondition: false;
  method: "setDisplayRange";
  mutating: true;
  path: "tempo set-display-range";
  takesParams: true;
  ungated: false;
}, {
  capability: "tempo.write";
  domain: "tempo";
  fingerprintPrecondition: true;
  method: "setPoint";
  mutating: true;
  path: "tempo set-point";
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
  capability: "timesig.read";
  domain: "timesig";
  fingerprintPrecondition: false;
  method: "list";
  mutating: false;
  path: "timesig list";
  takesParams: false;
  ungated: false;
}, {
  capability: "timesig.write";
  domain: "timesig";
  fingerprintPrecondition: true;
  method: "removeAt";
  mutating: true;
  path: "timesig remove-at";
  takesParams: true;
  ungated: false;
}, {
  capability: "timesig.write";
  domain: "timesig";
  fingerprintPrecondition: true;
  method: "set";
  mutating: true;
  path: "timesig set";
  takesParams: true;
  ungated: false;
}, {
  capability: "timesig.write";
  domain: "timesig";
  fingerprintPrecondition: true;
  method: "setAt";
  mutating: true;
  path: "timesig set-at";
  takesParams: true;
  ungated: false;
}, {
  capability: "track.write";
  domain: "track";
  fingerprintPrecondition: false;
  method: "create";
  mutating: true;
  path: "track create";
  takesParams: true;
  ungated: false;
}, {
  capability: "track.write";
  domain: "track";
  fingerprintPrecondition: false;
  method: "delete";
  mutating: true;
  path: "track delete";
  takesParams: true;
  ungated: false;
}, {
  capability: "track.write";
  domain: "track";
  fingerprintPrecondition: false;
  method: "duplicate";
  mutating: true;
  path: "track duplicate";
  takesParams: true;
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
  takesParams: true;
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
  method: "reorder";
  mutating: true;
  path: "track reorder";
  takesParams: true;
  ungated: false;
}, {
  capability: "track.read";
  domain: "track";
  fingerprintPrecondition: false;
  method: "resolve";
  mutating: false;
  path: "track resolve";
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
  method: "setInput";
  mutating: true;
  path: "track set-input";
  takesParams: true;
  ungated: false;
}, {
  capability: "track.write";
  domain: "track";
  fingerprintPrecondition: false;
  method: "setLanguage";
  mutating: true;
  path: "track set-language";
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
  capability: "vocalparam.read";
  domain: "vocalparam";
  fingerprintPrecondition: false;
  method: "read";
  mutating: false;
  path: "vocalparam read";
  takesParams: true;
  ungated: false;
}, {
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
  method: "community";
  mutating: false;
  path: "voice community";
  takesParams: true;
  ungated: false;
}, {
  capability: "voice.read";
  domain: "voice";
  fingerprintPrecondition: false;
  method: "seeds";
  mutating: false;
  path: "voice seeds";
  takesParams: true;
  ungated: false;
}, {
  capability: "voice.read";
  domain: "voice";
  fingerprintPrecondition: false;
  method: "synthModels";
  mutating: false;
  path: "voice synth-models";
  takesParams: true;
  ungated: false;
}] = OPERATIONS;
```

### requiredTokens

```ts
readonly requiredTokens: {
  blend add: "voice.write";
  blend create: "voice.write";
  blend delete: "voice.write";
  blend get: "voice.read";
  blend list: "voice.read";
  blend remove: "voice.write";
  blend reorder: "voice.write";
  blend set: "voice.write";
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
  clip audio-content: "clip.read";
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
  export fcpxml: "export.invoke";
  export lrc: "export.invoke";
  export midi: "export.invoke";
  export song-template: "export.invoke";
  export video: "export.invoke";
  export vocal-sample: "export.invoke";
  fx add: "fx.write";
  fx apply-preset: "fx.write";
  fx get-params: "fx.read";
  fx list: "fx.read";
  fx list-available: "fx.read";
  fx list-params: "fx.read";
  fx open-editor: "ui.control";
  fx remove: "fx.write";
  fx reorder: "fx.write";
  fx save-preset: "fx.write";
  fx scan: "fx.write";
  fx set: "fx.write";
  fx set-param: "fx.write";
  fx set-room: "fx.write";
  generative add-layer: "generative.add-layer";
  generative enhance: "generative.enhance";
  generative seed-audio: "generative.seed-audio";
  generative song: "generative.song";
  generative sound-effects: "generative.sound-effects";
  generative stem-split: "generative.stem-split";
  generative text2sample: "generative.text2sample";
  generative vocal2midi: "generative.vocal2midi";
  generative voice-change: "generative.voice-change";
  history list: "history.read";
  history redo: "history.control";
  history undo: "history.control";
  import file: "import.invoke";
  instrument disable: "soundsource.write";
  instrument enable: "soundsource.write";
  instrument set: "soundsource.write";
  job cancel: "job.control";
  job discard-result: "job.control";
  job get: "job.read";
  job list: "job.read";
  job place: "clip.write";
  job results: "job.read";
  job wait: "job.read";
  note add: "note.write";
  note delete: "note.write";
  note get: "note.read";
  note move: "note.write";
  note resize: "note.write";
  note set-articulation: "note.write";
  note set-lyric: "note.write";
  note split: "note.write";
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
  vocalparam write: "vocalparam.write";
  voice collect: "voice.write";
  voice community: "voice.read";
  voice seeds: "voice.read";
  voice synth-models: "voice.read";
} = REQUIRED_TOKENS;
```

#### requiredTokens.blend add

```ts
readonly blend add: "voice.write" = 'voice.write';
```

#### requiredTokens.blend create

```ts
readonly blend create: "voice.write" = 'voice.write';
```

#### requiredTokens.blend delete

```ts
readonly blend delete: "voice.write" = 'voice.write';
```

#### requiredTokens.blend get

```ts
readonly blend get: "voice.read" = 'voice.read';
```

#### requiredTokens.blend list

```ts
readonly blend list: "voice.read" = 'voice.read';
```

#### requiredTokens.blend remove

```ts
readonly blend remove: "voice.write" = 'voice.write';
```

#### requiredTokens.blend reorder

```ts
readonly blend reorder: "voice.write" = 'voice.write';
```

#### requiredTokens.blend set

```ts
readonly blend set: "voice.write" = 'voice.write';
```

#### requiredTokens.canvas effective-size

```ts
readonly canvas effective-size: "canvas.read" = 'canvas.read';
```

#### requiredTokens.canvas info

```ts
readonly canvas info: "canvas.read" = 'canvas.read';
```

#### requiredTokens.caret get

```ts
readonly caret get: "caret.read" = 'caret.read';
```

#### requiredTokens.caret set

```ts
readonly caret set: "caret.write" = 'caret.write';
```

#### requiredTokens.choir add

```ts
readonly choir add: "soundsource.write" = 'soundsource.write';
```

#### requiredTokens.choir disable

```ts
readonly choir disable: "soundsource.write" = 'soundsource.write';
```

#### requiredTokens.choir enable

```ts
readonly choir enable: "soundsource.write" = 'soundsource.write';
```

#### requiredTokens.choir get

```ts
readonly choir get: "soundsource.read" = 'soundsource.read';
```

#### requiredTokens.choir remove

```ts
readonly choir remove: "soundsource.write" = 'soundsource.write';
```

#### requiredTokens.choir reorder

```ts
readonly choir reorder: "soundsource.write" = 'soundsource.write';
```

#### requiredTokens.choir set

```ts
readonly choir set: "soundsource.write" = 'soundsource.write';
```

#### requiredTokens.clip audio-content

```ts
readonly clip audio-content: "clip.read" = 'clip.read';
```

#### requiredTokens.clip consolidate

```ts
readonly clip consolidate: "clip.write" = 'clip.write';
```

#### requiredTokens.clip create

```ts
readonly clip create: "clip.write" = 'clip.write';
```

#### requiredTokens.clip delete

```ts
readonly clip delete: "clip.write" = 'clip.write';
```

#### requiredTokens.clip detach-audio

```ts
readonly clip detach-audio: "clip.write" = 'clip.write';
```

#### requiredTokens.clip duplicate

```ts
readonly clip duplicate: "clip.write" = 'clip.write';
```

#### requiredTokens.clip get

```ts
readonly clip get: "clip.read" = 'clip.read';
```

#### requiredTokens.clip list

```ts
readonly clip list: "clip.read" = 'clip.read';
```

#### requiredTokens.clip lyrics

```ts
readonly clip lyrics: "clip.read" = 'clip.read';
```

#### requiredTokens.clip move

```ts
readonly clip move: "clip.write" = 'clip.write';
```

#### requiredTokens.clip note-content

```ts
readonly clip note-content: "clip.read" = 'clip.read';
```

#### requiredTokens.clip reattach-audio

```ts
readonly clip reattach-audio: "clip.write" = 'clip.write';
```

#### requiredTokens.clip replace-content

```ts
readonly clip replace-content: "clip.write" = 'clip.write';
```

#### requiredTokens.clip resize

```ts
readonly clip resize: "clip.write" = 'clip.write';
```

#### requiredTokens.clip set

```ts
readonly clip set: "clip.write" = 'clip.write';
```

#### requiredTokens.clip set-enabled

```ts
readonly clip set-enabled: "clip.write" = 'clip.write';
```

#### requiredTokens.clip set-fades

```ts
readonly clip set-fades: "clip.write" = 'clip.write';
```

#### requiredTokens.clip set-gain

```ts
readonly clip set-gain: "clip.write" = 'clip.write';
```

#### requiredTokens.clip set-muted

```ts
readonly clip set-muted: "clip.write" = 'clip.write';
```

#### requiredTokens.clip split

```ts
readonly clip split: "clip.write" = 'clip.write';
```

#### requiredTokens.device current

```ts
readonly device current: "device.read" = 'device.read';
```

#### requiredTokens.device list

```ts
readonly device list: "device.read" = 'device.read';
```

#### requiredTokens.device set-audio

```ts
readonly device set-audio: "device.write" = 'device.write';
```

#### requiredTokens.editor current-clip

```ts
readonly editor current-clip: "editor.read" = 'editor.read';
```

#### requiredTokens.editor open

```ts
readonly editor open: "editor.write" = 'editor.write';
```

#### requiredTokens.editor status

```ts
readonly editor status: "editor.read" = 'editor.read';
```

#### requiredTokens.editor tick-range

```ts
readonly editor tick-range: "editor.read" = 'editor.read';
```

#### requiredTokens.ensemble add

```ts
readonly ensemble add: "soundsource.write" = 'soundsource.write';
```

#### requiredTokens.ensemble disable

```ts
readonly ensemble disable: "soundsource.write" = 'soundsource.write';
```

#### requiredTokens.ensemble enable

```ts
readonly ensemble enable: "soundsource.write" = 'soundsource.write';
```

#### requiredTokens.ensemble get

```ts
readonly ensemble get: "soundsource.read" = 'soundsource.read';
```

#### requiredTokens.ensemble remove

```ts
readonly ensemble remove: "soundsource.write" = 'soundsource.write';
```

#### requiredTokens.ensemble reorder

```ts
readonly ensemble reorder: "soundsource.write" = 'soundsource.write';
```

#### requiredTokens.ensemble set

```ts
readonly ensemble set: "soundsource.write" = 'soundsource.write';
```

#### requiredTokens.export audio

```ts
readonly export audio: "export.invoke" = 'export.invoke';
```

#### requiredTokens.export fcpxml

```ts
readonly export fcpxml: "export.invoke" = 'export.invoke';
```

#### requiredTokens.export lrc

```ts
readonly export lrc: "export.invoke" = 'export.invoke';
```

#### requiredTokens.export midi

```ts
readonly export midi: "export.invoke" = 'export.invoke';
```

#### requiredTokens.export song-template

```ts
readonly export song-template: "export.invoke" = 'export.invoke';
```

#### requiredTokens.export video

```ts
readonly export video: "export.invoke" = 'export.invoke';
```

#### requiredTokens.export vocal-sample

```ts
readonly export vocal-sample: "export.invoke" = 'export.invoke';
```

#### requiredTokens.fx add

```ts
readonly fx add: "fx.write" = 'fx.write';
```

#### requiredTokens.fx apply-preset

```ts
readonly fx apply-preset: "fx.write" = 'fx.write';
```

#### requiredTokens.fx get-params

```ts
readonly fx get-params: "fx.read" = 'fx.read';
```

#### requiredTokens.fx list

```ts
readonly fx list: "fx.read" = 'fx.read';
```

#### requiredTokens.fx list-available

```ts
readonly fx list-available: "fx.read" = 'fx.read';
```

#### requiredTokens.fx list-params

```ts
readonly fx list-params: "fx.read" = 'fx.read';
```

#### requiredTokens.fx open-editor

```ts
readonly fx open-editor: "ui.control" = 'ui.control';
```

#### requiredTokens.fx remove

```ts
readonly fx remove: "fx.write" = 'fx.write';
```

#### requiredTokens.fx reorder

```ts
readonly fx reorder: "fx.write" = 'fx.write';
```

#### requiredTokens.fx save-preset

```ts
readonly fx save-preset: "fx.write" = 'fx.write';
```

#### requiredTokens.fx scan

```ts
readonly fx scan: "fx.write" = 'fx.write';
```

#### requiredTokens.fx set

```ts
readonly fx set: "fx.write" = 'fx.write';
```

#### requiredTokens.fx set-param

```ts
readonly fx set-param: "fx.write" = 'fx.write';
```

#### requiredTokens.fx set-room

```ts
readonly fx set-room: "fx.write" = 'fx.write';
```

#### requiredTokens.generative add-layer

```ts
readonly generative add-layer: "generative.add-layer" = 'generative.add-layer';
```

#### requiredTokens.generative enhance

```ts
readonly generative enhance: "generative.enhance" = 'generative.enhance';
```

#### requiredTokens.generative seed-audio

```ts
readonly generative seed-audio: "generative.seed-audio" = 'generative.seed-audio';
```

#### requiredTokens.generative song

```ts
readonly generative song: "generative.song" = 'generative.song';
```

#### requiredTokens.generative sound-effects

```ts
readonly generative sound-effects: "generative.sound-effects" = 'generative.sound-effects';
```

#### requiredTokens.generative stem-split

```ts
readonly generative stem-split: "generative.stem-split" = 'generative.stem-split';
```

#### requiredTokens.generative text2sample

```ts
readonly generative text2sample: "generative.text2sample" = 'generative.text2sample';
```

#### requiredTokens.generative vocal2midi

```ts
readonly generative vocal2midi: "generative.vocal2midi" = 'generative.vocal2midi';
```

#### requiredTokens.generative voice-change

```ts
readonly generative voice-change: "generative.voice-change" = 'generative.voice-change';
```

#### requiredTokens.history list

```ts
readonly history list: "history.read" = 'history.read';
```

#### requiredTokens.history redo

```ts
readonly history redo: "history.control" = 'history.control';
```

#### requiredTokens.history undo

```ts
readonly history undo: "history.control" = 'history.control';
```

#### requiredTokens.import file

```ts
readonly import file: "import.invoke" = 'import.invoke';
```

#### requiredTokens.instrument disable

```ts
readonly instrument disable: "soundsource.write" = 'soundsource.write';
```

#### requiredTokens.instrument enable

```ts
readonly instrument enable: "soundsource.write" = 'soundsource.write';
```

#### requiredTokens.instrument set

```ts
readonly instrument set: "soundsource.write" = 'soundsource.write';
```

#### requiredTokens.job cancel

```ts
readonly job cancel: "job.control" = 'job.control';
```

#### requiredTokens.job discard-result

```ts
readonly job discard-result: "job.control" = 'job.control';
```

#### requiredTokens.job get

```ts
readonly job get: "job.read" = 'job.read';
```

#### requiredTokens.job list

```ts
readonly job list: "job.read" = 'job.read';
```

#### requiredTokens.job place

```ts
readonly job place: "clip.write" = 'clip.write';
```

#### requiredTokens.job results

```ts
readonly job results: "job.read" = 'job.read';
```

#### requiredTokens.job wait

```ts
readonly job wait: "job.read" = 'job.read';
```

#### requiredTokens.note add

```ts
readonly note add: "note.write" = 'note.write';
```

#### requiredTokens.note delete

```ts
readonly note delete: "note.write" = 'note.write';
```

#### requiredTokens.note get

```ts
readonly note get: "note.read" = 'note.read';
```

#### requiredTokens.note move

```ts
readonly note move: "note.write" = 'note.write';
```

#### requiredTokens.note resize

```ts
readonly note resize: "note.write" = 'note.write';
```

#### requiredTokens.note set-articulation

```ts
readonly note set-articulation: "note.write" = 'note.write';
```

#### requiredTokens.note set-lyric

```ts
readonly note set-lyric: "note.write" = 'note.write';
```

#### requiredTokens.note split

```ts
readonly note split: "note.write" = 'note.write';
```

#### requiredTokens.project collect-save

```ts
readonly project collect-save: "project.lifecycle" = 'project.lifecycle';
```

#### requiredTokens.project dirty

```ts
readonly project dirty: "project.read" = 'project.read';
```

#### requiredTokens.project info

```ts
readonly project info: "project.read" = 'project.read';
```

#### requiredTokens.project new

```ts
readonly project new: "project.lifecycle" = 'project.lifecycle';
```

#### requiredTokens.project open

```ts
readonly project open: "project.lifecycle" = 'project.lifecycle';
```

#### requiredTokens.project recent

```ts
readonly project recent: "project.read" = 'project.read';
```

#### requiredTokens.project recent-clear

```ts
readonly project recent-clear: "project.lifecycle" = 'project.lifecycle';
```

#### requiredTokens.project save

```ts
readonly project save: "project.lifecycle" = 'project.lifecycle';
```

#### requiredTokens.project save-as

```ts
readonly project save-as: "project.lifecycle" = 'project.lifecycle';
```

#### requiredTokens.project synthesis-status

```ts
readonly project synthesis-status: "project.read" = 'project.read';
```

#### requiredTokens.recording start

```ts
readonly recording start: "recording.control" = 'recording.control';
```

#### requiredTokens.recording stop

```ts
readonly recording stop: "recording.control" = 'recording.control';
```

#### requiredTokens.selection get

```ts
readonly selection get: "selection.read" = 'selection.read';
```

#### requiredTokens.selection set

```ts
readonly selection set: "selection.write" = 'selection.write';
```

#### requiredTokens.sound-source get

```ts
readonly sound-source get: "soundsource.read" = 'soundsource.read';
```

#### requiredTokens.sound-source list

```ts
readonly sound-source list: "soundsource.read" = 'soundsource.read';
```

#### requiredTokens.sound-source load

```ts
readonly sound-source load: "soundsource.write" = 'soundsource.write';
```

#### requiredTokens.sound-source set

```ts
readonly sound-source set: "soundsource.write" = 'soundsource.write';
```

#### requiredTokens.sound-source tags

```ts
readonly sound-source tags: "soundsource.read" = 'soundsource.read';
```

#### requiredTokens.sound-source unload

```ts
readonly sound-source unload: "soundsource.write" = 'soundsource.write';
```

#### requiredTokens.tempo analyze

```ts
readonly tempo analyze: "tempo.analyze" = 'tempo.analyze';
```

#### requiredTokens.tempo apply-beat-analysis

```ts
readonly tempo apply-beat-analysis: "tempo.applyV2" = 'tempo.applyV2';
```

#### requiredTokens.tempo get

```ts
readonly tempo get: "tempo.read" = 'tempo.read';
```

#### requiredTokens.tempo points

```ts
readonly tempo points: "tempo.read" = 'tempo.read';
```

#### requiredTokens.tempo remove-point

```ts
readonly tempo remove-point: "tempo.write" = 'tempo.write';
```

#### requiredTokens.tempo set

```ts
readonly tempo set: "tempo.write" = 'tempo.write';
```

#### requiredTokens.tempo set-display-range

```ts
readonly tempo set-display-range: "tempo.write" = 'tempo.write';
```

#### requiredTokens.tempo set-point

```ts
readonly tempo set-point: "tempo.write" = 'tempo.write';
```

#### requiredTokens.timesig get

```ts
readonly timesig get: "timesig.read" = 'timesig.read';
```

#### requiredTokens.timesig list

```ts
readonly timesig list: "timesig.read" = 'timesig.read';
```

#### requiredTokens.timesig remove-at

```ts
readonly timesig remove-at: "timesig.write" = 'timesig.write';
```

#### requiredTokens.timesig set

```ts
readonly timesig set: "timesig.write" = 'timesig.write';
```

#### requiredTokens.timesig set-at

```ts
readonly timesig set-at: "timesig.write" = 'timesig.write';
```

#### requiredTokens.track create

```ts
readonly track create: "track.write" = 'track.write';
```

#### requiredTokens.track delete

```ts
readonly track delete: "track.write" = 'track.write';
```

#### requiredTokens.track duplicate

```ts
readonly track duplicate: "track.write" = 'track.write';
```

#### requiredTokens.track get

```ts
readonly track get: "track.read" = 'track.read';
```

#### requiredTokens.track list

```ts
readonly track list: "track.read" = 'track.read';
```

#### requiredTokens.track rename

```ts
readonly track rename: "track.write" = 'track.write';
```

#### requiredTokens.track reorder

```ts
readonly track reorder: "track.write" = 'track.write';
```

#### requiredTokens.track resolve

```ts
readonly track resolve: "track.read" = 'track.read';
```

#### requiredTokens.track set

```ts
readonly track set: "track.write" = 'track.write';
```

#### requiredTokens.track set-input

```ts
readonly track set-input: "track.write" = 'track.write';
```

#### requiredTokens.track set-language

```ts
readonly track set-language: "track.write" = 'track.write';
```

#### requiredTokens.transport loop

```ts
readonly transport loop: "transport.state" = 'transport.state';
```

#### requiredTokens.transport metronome

```ts
readonly transport metronome: "transport.control" = 'transport.control';
```

#### requiredTokens.transport play

```ts
readonly transport play: "transport.control" = 'transport.control';
```

#### requiredTokens.transport seek

```ts
readonly transport seek: "transport.control" = 'transport.control';
```

#### requiredTokens.transport set-loop

```ts
readonly transport set-loop: "transport.control" = 'transport.control';
```

#### requiredTokens.transport state

```ts
readonly transport state: "transport.state" = 'transport.state';
```

#### requiredTokens.transport stop

```ts
readonly transport stop: "transport.control" = 'transport.control';
```

#### requiredTokens.transport toggle

```ts
readonly transport toggle: "transport.control" = 'transport.control';
```

#### requiredTokens.ui get

```ts
readonly ui get: "ui.state" = 'ui.state';
```

#### requiredTokens.ui hide-panel

```ts
readonly ui hide-panel: "ui.control" = 'ui.control';
```

#### requiredTokens.ui hide-special-track

```ts
readonly ui hide-special-track: "ui.control" = 'ui.control';
```

#### requiredTokens.ui hide-window

```ts
readonly ui hide-window: "ui.control" = 'ui.control';
```

#### requiredTokens.ui show-panel

```ts
readonly ui show-panel: "ui.control" = 'ui.control';
```

#### requiredTokens.ui show-special-track

```ts
readonly ui show-special-track: "ui.control" = 'ui.control';
```

#### requiredTokens.ui show-window

```ts
readonly ui show-window: "ui.control" = 'ui.control';
```

#### requiredTokens.vocalparam layers

```ts
readonly vocalparam layers: "vocalparam.read" = 'vocalparam.read';
```

#### requiredTokens.vocalparam read

```ts
readonly vocalparam read: "vocalparam.read" = 'vocalparam.read';
```

#### requiredTokens.vocalparam write

```ts
readonly vocalparam write: "vocalparam.write" = 'vocalparam.write';
```

#### requiredTokens.voice collect

```ts
readonly voice collect: "voice.write" = 'voice.write';
```

#### requiredTokens.voice community

```ts
readonly voice community: "voice.read" = 'voice.read';
```

#### requiredTokens.voice seeds

```ts
readonly voice seeds: "voice.read" = 'voice.read';
```

#### requiredTokens.voice synth-models

```ts
readonly voice synth-models: "voice.read" = 'voice.read';
```

### tokens

```ts
readonly tokens: readonly ["canvas.read", "caret.read", "caret.write", "chord.read", "chord.write", "clip.read", "clip.write", "device.read", "device.write", "editor.read", "editor.write", "export.invoke", "fx.read", "fx.write", "generative.add-layer", "generative.enhance", "generative.seed-audio", "generative.song", "generative.sound-effects", "generative.stem-split", "generative.text2sample", "generative.vocal2midi", "generative.voice-change", "history.control", "history.read", "import.invoke", "job.control", "job.read", "lyric.read", "lyric.write", "note.read", "note.write", "project.lifecycle", "project.read", "recording.control", "selection.read", "selection.write", "session.handshake", "session.move", "session.ping", "session.shutdown", "soundsource.read", "soundsource.write", "tempo.analyze", "tempo.applyV2", "tempo.read", "tempo.write", "timesig.read", "timesig.write", "track.read", "track.write", "transport.control", "transport.state", "ui.control", "ui.state", "vocalparam.read", "vocalparam.write", "voice.read", "voice.write", "workflow.dev", "workflow.ui"] = CAPABILITY_TOKENS;
```
