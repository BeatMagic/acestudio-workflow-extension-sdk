# Variable: OPERATIONS

```ts
const OPERATIONS: readonly [{
  capability: "audioplugin.write";
  domain: "audio-plugin";
  fingerprintPrecondition: true;
  method: "applyPreset";
  mutating: true;
  path: "audio-plugin apply-preset";
  takesParams: true;
  ungated: false;
  wire: "audioPlugin.applyPreset";
}, {
  capability: "audioplugin.read";
  domain: "audio-plugin";
  fingerprintPrecondition: false;
  method: "editorCapture";
  mutating: false;
  path: "audio-plugin editor capture";
  takesParams: true;
  ungated: false;
  wire: "audioPlugin.editor.capture";
}, {
  capability: "audioplugin.control";
  domain: "audio-plugin";
  fingerprintPrecondition: false;
  method: "editorClick";
  mutating: true;
  path: "audio-plugin editor click";
  takesParams: true;
  ungated: false;
  wire: "audioPlugin.editor.click";
}, {
  capability: "ui.control";
  domain: "audio-plugin";
  fingerprintPrecondition: false;
  method: "editorClose";
  mutating: true;
  path: "audio-plugin editor close";
  takesParams: true;
  ungated: false;
  wire: "audioPlugin.editor.close";
}, {
  capability: "audioplugin.control";
  domain: "audio-plugin";
  fingerprintPrecondition: false;
  method: "editorDblclick";
  mutating: true;
  path: "audio-plugin editor dblclick";
  takesParams: true;
  ungated: false;
  wire: "audioPlugin.editor.dblclick";
}, {
  capability: "audioplugin.control";
  domain: "audio-plugin";
  fingerprintPrecondition: false;
  method: "editorDrag";
  mutating: true;
  path: "audio-plugin editor drag";
  takesParams: true;
  ungated: false;
  wire: "audioPlugin.editor.drag";
}, {
  capability: "audioplugin.control";
  domain: "audio-plugin";
  fingerprintPrecondition: false;
  method: "editorHover";
  mutating: true;
  path: "audio-plugin editor hover";
  takesParams: true;
  ungated: false;
  wire: "audioPlugin.editor.hover";
}, {
  capability: "audioplugin.read";
  domain: "audio-plugin";
  fingerprintPrecondition: false;
  method: "editorInfo";
  mutating: false;
  path: "audio-plugin editor info";
  takesParams: true;
  ungated: false;
  wire: "audioPlugin.editor.info";
}, {
  capability: "audioplugin.control";
  domain: "audio-plugin";
  fingerprintPrecondition: false;
  method: "editorKey";
  mutating: true;
  path: "audio-plugin editor key";
  takesParams: true;
  ungated: false;
  wire: "audioPlugin.editor.key";
}, {
  capability: "ui.control";
  domain: "audio-plugin";
  fingerprintPrecondition: false;
  method: "editorOpen";
  mutating: true;
  path: "audio-plugin editor open";
  takesParams: true;
  ungated: false;
  wire: "audioPlugin.editor.open";
}, {
  capability: "audioplugin.control";
  domain: "audio-plugin";
  fingerprintPrecondition: false;
  method: "editorResize";
  mutating: true;
  path: "audio-plugin editor resize";
  takesParams: true;
  ungated: false;
  wire: "audioPlugin.editor.resize";
}, {
  capability: "audioplugin.control";
  domain: "audio-plugin";
  fingerprintPrecondition: false;
  method: "editorType";
  mutating: true;
  path: "audio-plugin editor type";
  takesParams: true;
  ungated: false;
  wire: "audioPlugin.editor.type";
}, {
  capability: "audioplugin.control";
  domain: "audio-plugin";
  fingerprintPrecondition: false;
  method: "editorWheel";
  mutating: true;
  path: "audio-plugin editor wheel";
  takesParams: true;
  ungated: false;
  wire: "audioPlugin.editor.wheel";
}, {
  capability: "audioplugin.read";
  domain: "audio-plugin";
  fingerprintPrecondition: false;
  method: "exportPreset";
  mutating: false;
  path: "audio-plugin export-preset";
  takesParams: true;
  ungated: false;
  wire: "audioPlugin.exportPreset";
}, {
  capability: "audioplugin.read";
  domain: "audio-plugin";
  fingerprintPrecondition: false;
  method: "findPresets";
  mutating: false;
  path: "audio-plugin find-presets";
  takesParams: true;
  ungated: false;
  wire: "audioPlugin.findPresets";
}, {
  capability: "audioplugin.read";
  domain: "audio-plugin";
  fingerprintPrecondition: false;
  method: "getParams";
  mutating: false;
  path: "audio-plugin get-params";
  takesParams: true;
  ungated: false;
  wire: "audioPlugin.getParams";
}, {
  capability: "audioplugin.read";
  domain: "audio-plugin";
  fingerprintPrecondition: false;
  method: "getState";
  mutating: false;
  path: "audio-plugin get-state";
  takesParams: true;
  ungated: false;
  wire: "audioPlugin.getState";
}, {
  capability: "audioplugin.write";
  domain: "audio-plugin";
  fingerprintPrecondition: false;
  method: "importPreset";
  mutating: true;
  path: "audio-plugin import-preset";
  takesParams: true;
  ungated: false;
  wire: "audioPlugin.importPreset";
}, {
  capability: "audioplugin.read";
  domain: "audio-plugin";
  fingerprintPrecondition: false;
  method: "listAvailable";
  mutating: false;
  path: "audio-plugin list-available";
  takesParams: true;
  ungated: false;
  wire: "audioPlugin.listAvailable";
}, {
  capability: "audioplugin.read";
  domain: "audio-plugin";
  fingerprintPrecondition: false;
  method: "listParams";
  mutating: false;
  path: "audio-plugin list-params";
  takesParams: true;
  ungated: false;
  wire: "audioPlugin.listParams";
}, {
  capability: "audioplugin.read";
  domain: "audio-plugin";
  fingerprintPrecondition: false;
  method: "listPresets";
  mutating: false;
  path: "audio-plugin list-presets";
  takesParams: true;
  ungated: false;
  wire: "audioPlugin.listPresets";
}, {
  capability: "audioplugin.write";
  domain: "audio-plugin";
  fingerprintPrecondition: false;
  method: "movePreset";
  mutating: true;
  path: "audio-plugin move-preset";
  takesParams: true;
  ungated: false;
  wire: "audioPlugin.movePreset";
}, {
  capability: "audioplugin.write";
  domain: "audio-plugin";
  fingerprintPrecondition: false;
  method: "removePreset";
  mutating: true;
  path: "audio-plugin remove-preset";
  takesParams: true;
  ungated: false;
  wire: "audioPlugin.removePreset";
}, {
  capability: "audioplugin.write";
  domain: "audio-plugin";
  fingerprintPrecondition: false;
  method: "savePreset";
  mutating: true;
  path: "audio-plugin save-preset";
  takesParams: true;
  ungated: false;
  wire: "audioPlugin.savePreset";
}, {
  capability: "audioplugin.write";
  domain: "audio-plugin";
  fingerprintPrecondition: false;
  method: "scan";
  mutating: true;
  path: "audio-plugin scan";
  takesParams: true;
  ungated: false;
  wire: "audioPlugin.scan";
}, {
  capability: "audioplugin.write";
  domain: "audio-plugin";
  fingerprintPrecondition: false;
  method: "set";
  mutating: true;
  path: "audio-plugin set";
  takesParams: true;
  ungated: false;
  wire: "audioPlugin.set";
}, {
  capability: "audioplugin.write";
  domain: "audio-plugin";
  fingerprintPrecondition: true;
  method: "setParam";
  mutating: true;
  path: "audio-plugin set-param";
  takesParams: true;
  ungated: false;
  wire: "audioPlugin.setParam";
}, {
  capability: "audioplugin.write";
  domain: "audio-plugin";
  fingerprintPrecondition: false;
  method: "setState";
  mutating: true;
  path: "audio-plugin set-state";
  takesParams: true;
  ungated: false;
  wire: "audioPlugin.setState";
}, {
  capability: "audioplugin.read";
  domain: "audio-plugin";
  fingerprintPrecondition: false;
  method: "slots";
  mutating: false;
  path: "audio-plugin slots";
  takesParams: true;
  ungated: false;
  wire: "audioPlugin.slots";
}, {
  capability: "voice.write";
  domain: "blend";
  fingerprintPrecondition: false;
  method: "add";
  mutating: true;
  path: "blend add";
  takesParams: true;
  ungated: false;
  wire: "blend.add";
}, {
  capability: "voice.write";
  domain: "blend";
  fingerprintPrecondition: false;
  method: "create";
  mutating: true;
  path: "blend create";
  takesParams: true;
  ungated: false;
  wire: "blend.create";
}, {
  capability: "voice.write";
  domain: "blend";
  fingerprintPrecondition: false;
  method: "delete";
  mutating: true;
  path: "blend delete";
  takesParams: true;
  ungated: false;
  wire: "blend.delete";
}, {
  capability: "voice.read";
  domain: "blend";
  fingerprintPrecondition: false;
  method: "get";
  mutating: false;
  path: "blend get";
  takesParams: true;
  ungated: false;
  wire: "blend.get";
}, {
  capability: "voice.read";
  domain: "blend";
  fingerprintPrecondition: false;
  method: "list";
  mutating: false;
  path: "blend list";
  takesParams: true;
  ungated: false;
  wire: "blend.list";
}, {
  capability: "voice.write";
  domain: "blend";
  fingerprintPrecondition: false;
  method: "promote";
  mutating: true;
  path: "blend promote";
  takesParams: true;
  ungated: false;
  wire: "blend.promote";
}, {
  capability: "voice.write";
  domain: "blend";
  fingerprintPrecondition: false;
  method: "remove";
  mutating: true;
  path: "blend remove";
  takesParams: true;
  ungated: false;
  wire: "blend.remove";
}, {
  capability: "voice.write";
  domain: "blend";
  fingerprintPrecondition: false;
  method: "reorder";
  mutating: true;
  path: "blend reorder";
  takesParams: true;
  ungated: false;
  wire: "blend.reorder";
}, {
  capability: "voice.write";
  domain: "blend";
  fingerprintPrecondition: false;
  method: "set";
  mutating: true;
  path: "blend set";
  takesParams: true;
  ungated: false;
  wire: "blend.set";
}, {
  capability: "vocalparam.read";
  domain: "breath";
  fingerprintPrecondition: false;
  method: "list";
  mutating: false;
  path: "breath list";
  takesParams: true;
  ungated: false;
  wire: "breath.list";
}, {
  capability: "vocalparam.write";
  domain: "breath";
  fingerprintPrecondition: true;
  method: "remove";
  mutating: true;
  path: "breath remove";
  takesParams: true;
  ungated: false;
  wire: "breath.remove";
}, {
  capability: "vocalparam.write";
  domain: "breath";
  fingerprintPrecondition: true;
  method: "set";
  mutating: true;
  path: "breath set";
  takesParams: true;
  ungated: false;
  wire: "breath.set";
}, {
  capability: "canvas.read";
  domain: "canvas";
  fingerprintPrecondition: false;
  method: "effectiveSize";
  mutating: false;
  path: "canvas effective-size";
  takesParams: false;
  ungated: false;
  wire: "canvas.effectiveSize";
}, {
  capability: "canvas.read";
  domain: "canvas";
  fingerprintPrecondition: false;
  method: "info";
  mutating: false;
  path: "canvas info";
  takesParams: false;
  ungated: false;
  wire: "canvas.info";
}, {
  capability: "caret.read";
  domain: "caret";
  fingerprintPrecondition: false;
  method: "get";
  mutating: false;
  path: "caret get";
  takesParams: true;
  ungated: false;
  wire: "caret.get";
}, {
  capability: "caret.write";
  domain: "caret";
  fingerprintPrecondition: false;
  method: "set";
  mutating: true;
  path: "caret set";
  takesParams: true;
  ungated: false;
  wire: "caret.set";
}, {
  capability: "soundsource.write";
  domain: "choir";
  fingerprintPrecondition: false;
  method: "add";
  mutating: true;
  path: "choir add";
  takesParams: true;
  ungated: false;
  wire: "choir.add";
}, {
  capability: "soundsource.write";
  domain: "choir";
  fingerprintPrecondition: false;
  method: "disable";
  mutating: true;
  path: "choir disable";
  takesParams: true;
  ungated: false;
  wire: "choir.disable";
}, {
  capability: "soundsource.write";
  domain: "choir";
  fingerprintPrecondition: false;
  method: "enable";
  mutating: true;
  path: "choir enable";
  takesParams: true;
  ungated: false;
  wire: "choir.enable";
}, {
  capability: "soundsource.read";
  domain: "choir";
  fingerprintPrecondition: false;
  method: "get";
  mutating: false;
  path: "choir get";
  takesParams: true;
  ungated: false;
  wire: "choir.get";
}, {
  capability: "soundsource.write";
  domain: "choir";
  fingerprintPrecondition: false;
  method: "remove";
  mutating: true;
  path: "choir remove";
  takesParams: true;
  ungated: false;
  wire: "choir.remove";
}, {
  capability: "soundsource.write";
  domain: "choir";
  fingerprintPrecondition: false;
  method: "reorder";
  mutating: true;
  path: "choir reorder";
  takesParams: true;
  ungated: false;
  wire: "choir.reorder";
}, {
  capability: "soundsource.write";
  domain: "choir";
  fingerprintPrecondition: false;
  method: "set";
  mutating: true;
  path: "choir set";
  takesParams: true;
  ungated: false;
  wire: "choir.set";
}, {
  capability: "chord.write";
  domain: "chord";
  fingerprintPrecondition: true;
  method: "delete";
  mutating: true;
  path: "chord delete";
  takesParams: true;
  ungated: false;
  wire: "chord.delete";
}, {
  capability: "chord.write";
  domain: "chord";
  fingerprintPrecondition: true;
  method: "insert";
  mutating: true;
  path: "chord insert";
  takesParams: true;
  ungated: false;
  wire: "chord.insert";
}, {
  capability: "chord.read";
  domain: "chord";
  fingerprintPrecondition: false;
  method: "list";
  mutating: false;
  path: "chord list";
  takesParams: true;
  ungated: false;
  wire: "chord.list";
}, {
  capability: "chord.write";
  domain: "chord";
  fingerprintPrecondition: true;
  method: "set";
  mutating: true;
  path: "chord set";
  takesParams: true;
  ungated: false;
  wire: "chord.set";
}, {
  capability: "clip.read";
  domain: "clip";
  fingerprintPrecondition: false;
  method: "audioContent";
  mutating: false;
  path: "clip audio-content";
  takesParams: true;
  ungated: false;
  wire: "clip.audioContent";
}, {
  capability: "clip.read";
  domain: "clip";
  fingerprintPrecondition: false;
  method: "beatContent";
  mutating: false;
  path: "clip beat-content";
  takesParams: true;
  ungated: false;
  wire: "clip.beatContent";
}, {
  capability: "clip.write";
  domain: "clip";
  fingerprintPrecondition: false;
  method: "consolidate";
  mutating: true;
  path: "clip consolidate";
  takesParams: true;
  ungated: false;
  wire: "clip.consolidate";
}, {
  capability: "clip.write";
  domain: "clip";
  fingerprintPrecondition: false;
  method: "create";
  mutating: true;
  path: "clip create";
  takesParams: true;
  ungated: false;
  wire: "clip.create";
}, {
  capability: "clip.write";
  domain: "clip";
  fingerprintPrecondition: false;
  method: "delete";
  mutating: true;
  path: "clip delete";
  takesParams: true;
  ungated: false;
  wire: "clip.delete";
}, {
  capability: "clip.write";
  domain: "clip";
  fingerprintPrecondition: false;
  method: "detachAudio";
  mutating: true;
  path: "clip detach-audio";
  takesParams: true;
  ungated: false;
  wire: "clip.detachAudio";
}, {
  capability: "clip.write";
  domain: "clip";
  fingerprintPrecondition: false;
  method: "duplicate";
  mutating: true;
  path: "clip duplicate";
  takesParams: true;
  ungated: false;
  wire: "clip.duplicate";
}, {
  capability: "clip.read";
  domain: "clip";
  fingerprintPrecondition: false;
  method: "get";
  mutating: false;
  path: "clip get";
  takesParams: true;
  ungated: false;
  wire: "clip.get";
}, {
  capability: "clip.read";
  domain: "clip";
  fingerprintPrecondition: false;
  method: "list";
  mutating: false;
  path: "clip list";
  takesParams: true;
  ungated: false;
  wire: "clip.list";
}, {
  capability: "clip.read";
  domain: "clip";
  fingerprintPrecondition: false;
  method: "lyrics";
  mutating: false;
  path: "clip lyrics";
  takesParams: true;
  ungated: false;
  wire: "clip.lyrics";
}, {
  capability: "clip.write";
  domain: "clip";
  fingerprintPrecondition: false;
  method: "move";
  mutating: true;
  path: "clip move";
  takesParams: true;
  ungated: false;
  wire: "clip.move";
}, {
  capability: "clip.read";
  domain: "clip";
  fingerprintPrecondition: false;
  method: "noteContent";
  mutating: false;
  path: "clip note-content";
  takesParams: true;
  ungated: false;
  wire: "clip.noteContent";
}, {
  capability: "clip.write";
  domain: "clip";
  fingerprintPrecondition: false;
  method: "reattachAudio";
  mutating: true;
  path: "clip reattach-audio";
  takesParams: true;
  ungated: false;
  wire: "clip.reattachAudio";
}, {
  capability: "clip.write";
  domain: "clip";
  fingerprintPrecondition: true;
  method: "replaceContent";
  mutating: true;
  path: "clip replace-content";
  takesParams: true;
  ungated: false;
  wire: "clip.replaceContent";
}, {
  capability: "clip.write";
  domain: "clip";
  fingerprintPrecondition: false;
  method: "resize";
  mutating: true;
  path: "clip resize";
  takesParams: true;
  ungated: false;
  wire: "clip.resize";
}, {
  capability: "clip.write";
  domain: "clip";
  fingerprintPrecondition: false;
  method: "set";
  mutating: true;
  path: "clip set";
  takesParams: true;
  ungated: false;
  wire: "clip.set";
}, {
  capability: "clip.write";
  domain: "clip";
  fingerprintPrecondition: false;
  method: "setEnabled";
  mutating: true;
  path: "clip set-enabled";
  takesParams: true;
  ungated: false;
  wire: "clip.setEnabled";
}, {
  capability: "clip.write";
  domain: "clip";
  fingerprintPrecondition: false;
  method: "setFades";
  mutating: true;
  path: "clip set-fades";
  takesParams: true;
  ungated: false;
  wire: "clip.setFades";
}, {
  capability: "clip.write";
  domain: "clip";
  fingerprintPrecondition: false;
  method: "setGain";
  mutating: true;
  path: "clip set-gain";
  takesParams: true;
  ungated: false;
  wire: "clip.setGain";
}, {
  capability: "clip.write";
  domain: "clip";
  fingerprintPrecondition: false;
  method: "setMuted";
  mutating: true;
  path: "clip set-muted";
  takesParams: true;
  ungated: false;
  wire: "clip.setMuted";
}, {
  capability: "clip.write";
  domain: "clip";
  fingerprintPrecondition: false;
  method: "split";
  mutating: true;
  path: "clip split";
  takesParams: true;
  ungated: false;
  wire: "clip.split";
}, {
  capability: "convert.editor-to-global";
  domain: "convert";
  fingerprintPrecondition: false;
  method: "editorToGlobal";
  mutating: false;
  path: "convert editor-to-global";
  takesParams: true;
  ungated: true;
  wire: "convert.editorToGlobal";
}, {
  capability: "convert.global-to-editor";
  domain: "convert";
  fingerprintPrecondition: false;
  method: "globalToEditor";
  mutating: false;
  path: "convert global-to-editor";
  takesParams: true;
  ungated: true;
  wire: "convert.globalToEditor";
}, {
  capability: "convert.measure-to-tick";
  domain: "convert";
  fingerprintPrecondition: false;
  method: "measureToTick";
  mutating: false;
  path: "convert measure-to-tick";
  takesParams: true;
  ungated: true;
  wire: "convert.measureToTick";
}, {
  capability: "convert.tick-to-measure";
  domain: "convert";
  fingerprintPrecondition: false;
  method: "tickToMeasure";
  mutating: false;
  path: "convert tick-to-measure";
  takesParams: true;
  ungated: true;
  wire: "convert.tickToMeasure";
}, {
  capability: "convert.tick-to-time";
  domain: "convert";
  fingerprintPrecondition: false;
  method: "tickToTime";
  mutating: false;
  path: "convert tick-to-time";
  takesParams: true;
  ungated: true;
  wire: "convert.tickToTime";
}, {
  capability: "convert.time-to-tick";
  domain: "convert";
  fingerprintPrecondition: false;
  method: "timeToTick";
  mutating: false;
  path: "convert time-to-tick";
  takesParams: true;
  ungated: true;
  wire: "convert.timeToTick";
}, {
  capability: "device.read";
  domain: "device";
  fingerprintPrecondition: false;
  method: "current";
  mutating: false;
  path: "device current";
  takesParams: false;
  ungated: false;
  wire: "device.current";
}, {
  capability: "device.read";
  domain: "device";
  fingerprintPrecondition: false;
  method: "list";
  mutating: false;
  path: "device list";
  takesParams: false;
  ungated: false;
  wire: "device.list";
}, {
  capability: "device.write";
  domain: "device";
  fingerprintPrecondition: false;
  method: "setAudio";
  mutating: true;
  path: "device set-audio";
  takesParams: true;
  ungated: false;
  wire: "device.setAudio";
}, {
  capability: "editor.read";
  domain: "editor";
  fingerprintPrecondition: false;
  method: "currentClip";
  mutating: false;
  path: "editor current-clip";
  takesParams: false;
  ungated: false;
  wire: "editor.currentClip";
}, {
  capability: "editor.write";
  domain: "editor";
  fingerprintPrecondition: false;
  method: "open";
  mutating: true;
  path: "editor open";
  takesParams: false;
  ungated: false;
  wire: "editor.open";
}, {
  capability: "editor.read";
  domain: "editor";
  fingerprintPrecondition: false;
  method: "status";
  mutating: false;
  path: "editor status";
  takesParams: false;
  ungated: false;
  wire: "editor.status";
}, {
  capability: "editor.read";
  domain: "editor";
  fingerprintPrecondition: false;
  method: "tickRange";
  mutating: false;
  path: "editor tick-range";
  takesParams: false;
  ungated: false;
  wire: "editor.tickRange";
}, {
  capability: "soundsource.write";
  domain: "ensemble";
  fingerprintPrecondition: false;
  method: "add";
  mutating: true;
  path: "ensemble add";
  takesParams: true;
  ungated: false;
  wire: "ensemble.add";
}, {
  capability: "soundsource.write";
  domain: "ensemble";
  fingerprintPrecondition: false;
  method: "disable";
  mutating: true;
  path: "ensemble disable";
  takesParams: true;
  ungated: false;
  wire: "ensemble.disable";
}, {
  capability: "soundsource.write";
  domain: "ensemble";
  fingerprintPrecondition: false;
  method: "enable";
  mutating: true;
  path: "ensemble enable";
  takesParams: true;
  ungated: false;
  wire: "ensemble.enable";
}, {
  capability: "soundsource.read";
  domain: "ensemble";
  fingerprintPrecondition: false;
  method: "get";
  mutating: false;
  path: "ensemble get";
  takesParams: true;
  ungated: false;
  wire: "ensemble.get";
}, {
  capability: "soundsource.write";
  domain: "ensemble";
  fingerprintPrecondition: false;
  method: "remove";
  mutating: true;
  path: "ensemble remove";
  takesParams: true;
  ungated: false;
  wire: "ensemble.remove";
}, {
  capability: "soundsource.write";
  domain: "ensemble";
  fingerprintPrecondition: false;
  method: "reorder";
  mutating: true;
  path: "ensemble reorder";
  takesParams: true;
  ungated: false;
  wire: "ensemble.reorder";
}, {
  capability: "soundsource.write";
  domain: "ensemble";
  fingerprintPrecondition: false;
  method: "set";
  mutating: true;
  path: "ensemble set";
  takesParams: true;
  ungated: false;
  wire: "ensemble.set";
}, {
  capability: "export.invoke";
  domain: "export";
  fingerprintPrecondition: false;
  method: "audio";
  mutating: true;
  path: "export audio";
  takesParams: true;
  ungated: false;
  wire: "export.audio";
}, {
  capability: "export.invoke";
  domain: "export";
  fingerprintPrecondition: false;
  method: "lrc";
  mutating: true;
  path: "export lrc";
  takesParams: true;
  ungated: false;
  wire: "export.lrc";
}, {
  capability: "export.invoke";
  domain: "export";
  fingerprintPrecondition: false;
  method: "midi";
  mutating: true;
  path: "export midi";
  takesParams: true;
  ungated: false;
  wire: "export.midi";
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
  wire: "export.songTemplate";
}, {
  capability: "export.invoke";
  domain: "export";
  fingerprintPrecondition: false;
  method: "timeline";
  mutating: true;
  path: "export timeline";
  takesParams: true;
  ungated: false;
  wire: "export.timeline";
}, {
  capability: "export.invoke";
  domain: "export";
  fingerprintPrecondition: false;
  method: "video";
  mutating: true;
  path: "export video";
  takesParams: true;
  ungated: false;
  wire: "export.video";
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
  wire: "export.vocalSample";
}, {
  capability: "audioplugin.write";
  domain: "fx";
  fingerprintPrecondition: false;
  method: "add";
  mutating: true;
  path: "fx add";
  takesParams: true;
  ungated: false;
  wire: "fx.add";
}, {
  capability: "audioplugin.write";
  domain: "fx";
  fingerprintPrecondition: false;
  method: "applyChain";
  mutating: true;
  path: "fx apply-chain";
  takesParams: true;
  ungated: false;
  wire: "fx.applyChain";
}, {
  capability: "audioplugin.read";
  domain: "fx";
  fingerprintPrecondition: false;
  method: "exportChain";
  mutating: false;
  path: "fx export-chain";
  takesParams: true;
  ungated: false;
  wire: "fx.exportChain";
}, {
  capability: "audioplugin.read";
  domain: "fx";
  fingerprintPrecondition: false;
  method: "findChains";
  mutating: false;
  path: "fx find-chains";
  takesParams: true;
  ungated: false;
  wire: "fx.findChains";
}, {
  capability: "audioplugin.write";
  domain: "fx";
  fingerprintPrecondition: false;
  method: "importChain";
  mutating: true;
  path: "fx import-chain";
  takesParams: true;
  ungated: false;
  wire: "fx.importChain";
}, {
  capability: "audioplugin.write";
  domain: "fx";
  fingerprintPrecondition: false;
  method: "insertChain";
  mutating: true;
  path: "fx insert-chain";
  takesParams: true;
  ungated: false;
  wire: "fx.insertChain";
}, {
  capability: "audioplugin.read";
  domain: "fx";
  fingerprintPrecondition: false;
  method: "listChains";
  mutating: false;
  path: "fx list-chains";
  takesParams: true;
  ungated: false;
  wire: "fx.listChains";
}, {
  capability: "audioplugin.write";
  domain: "fx";
  fingerprintPrecondition: false;
  method: "moveChain";
  mutating: true;
  path: "fx move-chain";
  takesParams: true;
  ungated: false;
  wire: "fx.moveChain";
}, {
  capability: "audioplugin.write";
  domain: "fx";
  fingerprintPrecondition: false;
  method: "remove";
  mutating: true;
  path: "fx remove";
  takesParams: true;
  ungated: false;
  wire: "fx.remove";
}, {
  capability: "audioplugin.write";
  domain: "fx";
  fingerprintPrecondition: false;
  method: "removeChain";
  mutating: true;
  path: "fx remove-chain";
  takesParams: true;
  ungated: false;
  wire: "fx.removeChain";
}, {
  capability: "audioplugin.write";
  domain: "fx";
  fingerprintPrecondition: false;
  method: "reorder";
  mutating: true;
  path: "fx reorder";
  takesParams: true;
  ungated: false;
  wire: "fx.reorder";
}, {
  capability: "audioplugin.write";
  domain: "fx";
  fingerprintPrecondition: false;
  method: "saveChain";
  mutating: true;
  path: "fx save-chain";
  takesParams: true;
  ungated: false;
  wire: "fx.saveChain";
}, {
  capability: "audioplugin.write";
  domain: "fx";
  fingerprintPrecondition: false;
  method: "setRoom";
  mutating: true;
  path: "fx set-room";
  takesParams: true;
  ungated: false;
  wire: "fx.setRoom";
}, {
  capability: "generative.add-a-layer";
  domain: "generative";
  entitlement: "credits(add-a-layer)";
  fingerprintPrecondition: false;
  method: "addALayer";
  mutating: true;
  path: "generative add-a-layer";
  takesParams: true;
  ungated: false;
  wire: "generative.addALayer";
}, {
  capability: "generative.inspire-me";
  domain: "generative";
  entitlement: "credits(song-generator)";
  fingerprintPrecondition: false;
  method: "inspireMe";
  mutating: true;
  path: "generative inspire-me";
  takesParams: true;
  ungated: false;
  wire: "generative.inspireMe";
}, {
  capability: "generative-history.read";
  domain: "generative";
  fingerprintPrecondition: false;
  method: "inspireMeHistoryGet";
  mutating: false;
  path: "generative inspire-me history get";
  takesParams: true;
  ungated: false;
  wire: "generative.inspireMe.history.get";
}, {
  capability: "generative-history.read";
  domain: "generative";
  fingerprintPrecondition: false;
  method: "inspireMeHistoryList";
  mutating: false;
  path: "generative inspire-me history list";
  takesParams: true;
  ungated: false;
  wire: "generative.inspireMe.history.list";
}, {
  capability: "generative.music-enhancer";
  domain: "generative";
  entitlement: "credits(music-enhancer)";
  fingerprintPrecondition: false;
  method: "musicEnhancer";
  mutating: true;
  path: "generative music-enhancer";
  takesParams: true;
  ungated: false;
  wire: "generative.musicEnhancer";
}, {
  capability: "generative-history.read";
  domain: "generative";
  fingerprintPrecondition: false;
  method: "musicEnhancerHistoryGet";
  mutating: false;
  path: "generative music-enhancer history get";
  takesParams: true;
  ungated: false;
  wire: "generative.musicEnhancer.history.get";
}, {
  capability: "generative-history.read";
  domain: "generative";
  fingerprintPrecondition: false;
  method: "musicEnhancerHistoryList";
  mutating: false;
  path: "generative music-enhancer history list";
  takesParams: true;
  ungated: false;
  wire: "generative.musicEnhancer.history.list";
}, {
  capability: "generative.stem-splitter";
  domain: "generative";
  entitlement: "credits(stem-splitter)";
  fingerprintPrecondition: false;
  method: "stemSplitter";
  mutating: true;
  path: "generative stem-splitter";
  takesParams: true;
  ungated: false;
  wire: "generative.stemSplitter";
}, {
  capability: "generative.vocal-to-midi";
  domain: "generative";
  fingerprintPrecondition: false;
  method: "vocalToMidi";
  mutating: true;
  path: "generative vocal-to-midi";
  takesParams: true;
  ungated: false;
  wire: "generative.vocalToMidi";
}, {
  capability: "generative.voice-changer";
  domain: "generative";
  fingerprintPrecondition: false;
  method: "voiceChangerConvert";
  mutating: true;
  path: "generative voice-changer convert";
  takesParams: true;
  ungated: false;
  wire: "generative.voiceChanger.convert";
}, {
  capability: "generative.voice-changer";
  domain: "generative";
  fingerprintPrecondition: false;
  method: "voiceChangerModels";
  mutating: true;
  path: "generative voice-changer models";
  takesParams: true;
  ungated: false;
  wire: "generative.voiceChanger.models";
}, {
  capability: "history.read";
  domain: "history";
  fingerprintPrecondition: false;
  method: "list";
  mutating: false;
  path: "history list";
  takesParams: true;
  ungated: false;
  wire: "history.list";
}, {
  capability: "history.control";
  domain: "history";
  fingerprintPrecondition: false;
  method: "redo";
  mutating: true;
  path: "history redo";
  takesParams: false;
  ungated: false;
  wire: "history.redo";
}, {
  capability: "history.control";
  domain: "history";
  fingerprintPrecondition: false;
  method: "undo";
  mutating: true;
  path: "history undo";
  takesParams: false;
  ungated: false;
  wire: "history.undo";
}, {
  capability: "import.invoke";
  domain: "import";
  fingerprintPrecondition: false;
  method: "file";
  mutating: true;
  path: "import file";
  takesParams: true;
  ungated: false;
  wire: "import.file";
}, {
  capability: "soundsource.write";
  domain: "instrument";
  fingerprintPrecondition: false;
  method: "set";
  mutating: true;
  path: "instrument set";
  takesParams: true;
  ungated: false;
  wire: "instrument.set";
}, {
  capability: "job.control";
  domain: "job";
  fingerprintPrecondition: false;
  method: "cancel";
  mutating: true;
  path: "job cancel";
  takesParams: true;
  ungated: false;
  wire: "job.cancel";
}, {
  capability: "job.control";
  domain: "job";
  fingerprintPrecondition: false;
  method: "discardResult";
  mutating: true;
  path: "job discard-result";
  takesParams: true;
  ungated: false;
  wire: "job.discardResult";
}, {
  capability: "job.control";
  domain: "job";
  fingerprintPrecondition: false;
  method: "download";
  mutating: true;
  path: "job download";
  takesParams: true;
  ungated: false;
  wire: "job.download";
}, {
  capability: "job.read";
  domain: "job";
  fingerprintPrecondition: false;
  method: "get";
  mutating: false;
  path: "job get";
  takesParams: true;
  ungated: false;
  wire: "job.get";
}, {
  capability: "job.read";
  domain: "job";
  fingerprintPrecondition: false;
  method: "list";
  mutating: false;
  path: "job list";
  takesParams: true;
  ungated: false;
  wire: "job.list";
}, {
  capability: "clip.write";
  domain: "job";
  fingerprintPrecondition: false;
  method: "place";
  mutating: true;
  path: "job place";
  takesParams: true;
  ungated: false;
  wire: "job.place";
}, {
  capability: "job.read";
  domain: "job";
  fingerprintPrecondition: false;
  method: "results";
  mutating: false;
  path: "job results";
  takesParams: true;
  ungated: false;
  wire: "job.results";
}, {
  capability: "job.read";
  domain: "job";
  fingerprintPrecondition: false;
  method: "wait";
  mutating: false;
  path: "job wait";
  takesParams: true;
  ungated: false;
  wire: "job.wait";
}, {
  capability: "lyric.write";
  domain: "lyric";
  fingerprintPrecondition: true;
  method: "fill";
  mutating: true;
  path: "lyric fill";
  takesParams: true;
  ungated: false;
  wire: "lyric.fill";
}, {
  capability: "midiparam.write";
  domain: "midiparam";
  fingerprintPrecondition: true;
  method: "clear";
  mutating: true;
  path: "midiparam clear";
  takesParams: true;
  ungated: false;
  wire: "midiparam.clear";
}, {
  capability: "midiparam.read";
  domain: "midiparam";
  fingerprintPrecondition: false;
  method: "listLanes";
  mutating: false;
  path: "midiparam list-lanes";
  takesParams: true;
  ungated: false;
  wire: "midiparam.listLanes";
}, {
  capability: "midiparam.read";
  domain: "midiparam";
  fingerprintPrecondition: false;
  method: "read";
  mutating: false;
  path: "midiparam read";
  takesParams: true;
  ungated: false;
  wire: "midiparam.read";
}, {
  capability: "midiparam.write";
  domain: "midiparam";
  fingerprintPrecondition: true;
  method: "removePoint";
  mutating: true;
  path: "midiparam remove-point";
  takesParams: true;
  ungated: false;
  wire: "midiparam.removePoint";
}, {
  capability: "midiparam.write";
  domain: "midiparam";
  fingerprintPrecondition: true;
  method: "setPoint";
  mutating: true;
  path: "midiparam set-point";
  takesParams: true;
  ungated: false;
  wire: "midiparam.setPoint";
}, {
  capability: "midiparam.write";
  domain: "midiparam";
  fingerprintPrecondition: true;
  method: "setVelocity";
  mutating: true;
  path: "midiparam set-velocity";
  takesParams: true;
  ungated: false;
  wire: "midiparam.setVelocity";
}, {
  capability: "midiparam.read";
  domain: "midiparam";
  fingerprintPrecondition: false;
  method: "velocity";
  mutating: false;
  path: "midiparam velocity";
  takesParams: true;
  ungated: false;
  wire: "midiparam.velocity";
}, {
  capability: "midiparam.write";
  domain: "midiparam";
  fingerprintPrecondition: true;
  method: "write";
  mutating: true;
  path: "midiparam write";
  takesParams: true;
  ungated: false;
  wire: "midiparam.write";
}, {
  capability: "note.write";
  domain: "note";
  fingerprintPrecondition: true;
  method: "add";
  mutating: true;
  path: "note add";
  takesParams: true;
  ungated: false;
  wire: "note.add";
}, {
  capability: "note.write";
  domain: "note";
  fingerprintPrecondition: true;
  method: "delete";
  mutating: true;
  path: "note delete";
  takesParams: true;
  ungated: false;
  wire: "note.delete";
}, {
  capability: "note.read";
  domain: "note";
  fingerprintPrecondition: false;
  method: "get";
  mutating: false;
  path: "note get";
  takesParams: true;
  ungated: false;
  wire: "note.get";
}, {
  capability: "note.write";
  domain: "note";
  fingerprintPrecondition: true;
  method: "move";
  mutating: true;
  path: "note move";
  takesParams: true;
  ungated: false;
  wire: "note.move";
}, {
  capability: "note.write";
  domain: "note";
  fingerprintPrecondition: true;
  method: "resize";
  mutating: true;
  path: "note resize";
  takesParams: true;
  ungated: false;
  wire: "note.resize";
}, {
  capability: "note.write";
  domain: "note";
  fingerprintPrecondition: true;
  method: "setArticulation";
  mutating: true;
  path: "note set-articulation";
  takesParams: true;
  ungated: false;
  wire: "note.setArticulation";
}, {
  capability: "note.write";
  domain: "note";
  fingerprintPrecondition: true;
  method: "setGrapheme";
  mutating: true;
  path: "note set-grapheme";
  takesParams: true;
  ungated: false;
  wire: "note.setGrapheme";
}, {
  capability: "note.write";
  domain: "note";
  fingerprintPrecondition: true;
  method: "setLanguage";
  mutating: true;
  path: "note set-language";
  takesParams: true;
  ungated: false;
  wire: "note.setLanguage";
}, {
  capability: "note.write";
  domain: "note";
  fingerprintPrecondition: true;
  method: "split";
  mutating: true;
  path: "note split";
  takesParams: true;
  ungated: false;
  wire: "note.split";
}, {
  capability: "lyric.read";
  domain: "phoneme";
  fingerprintPrecondition: false;
  method: "g2p";
  mutating: false;
  path: "phoneme g2p";
  takesParams: true;
  ungated: false;
  wire: "phoneme.g2p";
}, {
  capability: "lyric.read";
  domain: "phoneme";
  fingerprintPrecondition: false;
  method: "inventory";
  mutating: false;
  path: "phoneme inventory";
  takesParams: true;
  ungated: false;
  wire: "phoneme.inventory";
}, {
  capability: "lyric.read";
  domain: "phoneme";
  fingerprintPrecondition: false;
  method: "list";
  mutating: false;
  path: "phoneme list";
  takesParams: true;
  ungated: false;
  wire: "phoneme.list";
}, {
  capability: "lyric.write";
  domain: "phoneme";
  fingerprintPrecondition: true;
  method: "moveBoundary";
  mutating: true;
  path: "phoneme move-boundary";
  takesParams: true;
  ungated: false;
  wire: "phoneme.moveBoundary";
}, {
  capability: "lyric.write";
  domain: "phoneme";
  fingerprintPrecondition: true;
  method: "reset";
  mutating: true;
  path: "phoneme reset";
  takesParams: true;
  ungated: false;
  wire: "phoneme.reset";
}, {
  capability: "lyric.write";
  domain: "phoneme";
  fingerprintPrecondition: true;
  method: "resetOverride";
  mutating: true;
  path: "phoneme reset-override";
  takesParams: true;
  ungated: false;
  wire: "phoneme.resetOverride";
}, {
  capability: "lyric.write";
  domain: "phoneme";
  fingerprintPrecondition: true;
  method: "resetTiming";
  mutating: true;
  path: "phoneme reset-timing";
  takesParams: true;
  ungated: false;
  wire: "phoneme.resetTiming";
}, {
  capability: "lyric.write";
  domain: "phoneme";
  fingerprintPrecondition: true;
  method: "set";
  mutating: true;
  path: "phoneme set";
  takesParams: true;
  ungated: false;
  wire: "phoneme.set";
}, {
  capability: "lyric.write";
  domain: "phoneme";
  fingerprintPrecondition: true;
  method: "setConsonantTiming";
  mutating: true;
  path: "phoneme set-consonant-timing";
  takesParams: true;
  ungated: false;
  wire: "phoneme.setConsonantTiming";
}, {
  capability: "project.lifecycle";
  domain: "project";
  fingerprintPrecondition: false;
  method: "collectSave";
  mutating: true;
  path: "project collect-save";
  takesParams: true;
  ungated: false;
  wire: "project.collectSave";
}, {
  capability: "project.read";
  domain: "project";
  fingerprintPrecondition: false;
  method: "dirty";
  mutating: false;
  path: "project dirty";
  takesParams: false;
  ungated: false;
  wire: "project.dirty";
}, {
  capability: "project.read";
  domain: "project";
  fingerprintPrecondition: false;
  method: "info";
  mutating: false;
  path: "project info";
  takesParams: false;
  ungated: false;
  wire: "project.info";
}, {
  capability: "project.lifecycle";
  domain: "project";
  fingerprintPrecondition: false;
  method: "new";
  mutating: true;
  path: "project new";
  takesParams: true;
  ungated: false;
  wire: "project.new";
}, {
  capability: "project.lifecycle";
  domain: "project";
  fingerprintPrecondition: false;
  method: "open";
  mutating: true;
  path: "project open";
  takesParams: true;
  ungated: false;
  wire: "project.open";
}, {
  capability: "project.read";
  domain: "project";
  fingerprintPrecondition: false;
  method: "recent";
  mutating: false;
  path: "project recent";
  takesParams: false;
  ungated: false;
  wire: "project.recent";
}, {
  capability: "project.lifecycle";
  domain: "project";
  fingerprintPrecondition: false;
  method: "recentClear";
  mutating: true;
  path: "project recent-clear";
  takesParams: false;
  ungated: false;
  wire: "project.recentClear";
}, {
  capability: "project.lifecycle";
  domain: "project";
  fingerprintPrecondition: false;
  method: "save";
  mutating: true;
  path: "project save";
  takesParams: false;
  ungated: false;
  wire: "project.save";
}, {
  capability: "project.lifecycle";
  domain: "project";
  fingerprintPrecondition: false;
  method: "saveAs";
  mutating: true;
  path: "project save-as";
  takesParams: true;
  ungated: false;
  wire: "project.saveAs";
}, {
  capability: "project.read";
  domain: "project";
  fingerprintPrecondition: false;
  method: "synthesisStatus";
  mutating: false;
  path: "project synthesis-status";
  takesParams: false;
  ungated: false;
  wire: "project.synthesisStatus";
}, {
  capability: "recording.control";
  domain: "recording";
  fingerprintPrecondition: false;
  method: "start";
  mutating: true;
  path: "recording start";
  takesParams: false;
  ungated: false;
  wire: "recording.start";
}, {
  capability: "recording.control";
  domain: "recording";
  fingerprintPrecondition: false;
  method: "stop";
  mutating: true;
  path: "recording stop";
  takesParams: false;
  ungated: false;
  wire: "recording.stop";
}, {
  capability: "selection.read";
  domain: "selection";
  fingerprintPrecondition: false;
  method: "get";
  mutating: false;
  path: "selection get";
  takesParams: true;
  ungated: false;
  wire: "selection.get";
}, {
  capability: "selection.write";
  domain: "selection";
  fingerprintPrecondition: false;
  method: "set";
  mutating: true;
  path: "selection set";
  takesParams: true;
  ungated: false;
  wire: "selection.set";
}, {
  capability: "soundsource.read";
  domain: "sound-source";
  fingerprintPrecondition: false;
  method: "get";
  mutating: false;
  path: "sound-source get";
  takesParams: true;
  ungated: false;
  wire: "soundSource.get";
}, {
  capability: "soundsource.read";
  domain: "sound-source";
  fingerprintPrecondition: false;
  method: "list";
  mutating: false;
  path: "sound-source list";
  takesParams: true;
  ungated: false;
  wire: "soundSource.list";
}, {
  capability: "soundsource.write";
  domain: "sound-source";
  fingerprintPrecondition: false;
  method: "load";
  mutating: true;
  path: "sound-source load";
  takesParams: true;
  ungated: false;
  wire: "soundSource.load";
}, {
  capability: "soundsource.write";
  domain: "sound-source";
  fingerprintPrecondition: false;
  method: "set";
  mutating: true;
  path: "sound-source set";
  takesParams: true;
  ungated: false;
  wire: "soundSource.set";
}, {
  capability: "soundsource.read";
  domain: "sound-source";
  fingerprintPrecondition: false;
  method: "tags";
  mutating: false;
  path: "sound-source tags";
  takesParams: true;
  ungated: false;
  wire: "soundSource.tags";
}, {
  capability: "soundsource.write";
  domain: "sound-source";
  fingerprintPrecondition: false;
  method: "unload";
  mutating: true;
  path: "sound-source unload";
  takesParams: true;
  ungated: false;
  wire: "soundSource.unload";
}, {
  capability: "tempo.analyze";
  domain: "tempo";
  fingerprintPrecondition: false;
  method: "analyze";
  mutating: true;
  path: "tempo analyze";
  takesParams: true;
  ungated: false;
  wire: "tempo.analyze";
}, {
  capability: "tempo.applyV2";
  domain: "tempo";
  fingerprintPrecondition: false;
  method: "applyBeatAnalysis";
  mutating: true;
  path: "tempo apply-beat-analysis";
  takesParams: true;
  ungated: false;
  wire: "tempo.applyBeatAnalysis";
}, {
  capability: "tempo.read";
  domain: "tempo";
  fingerprintPrecondition: false;
  method: "get";
  mutating: false;
  path: "tempo get";
  takesParams: false;
  ungated: false;
  wire: "tempo.get";
}, {
  capability: "tempo.read";
  domain: "tempo";
  fingerprintPrecondition: false;
  method: "getAnalysis";
  mutating: false;
  path: "tempo get-analysis";
  takesParams: true;
  ungated: false;
  wire: "tempo.getAnalysis";
}, {
  capability: "tempo.read";
  domain: "tempo";
  fingerprintPrecondition: false;
  method: "points";
  mutating: false;
  path: "tempo points";
  takesParams: false;
  ungated: false;
  wire: "tempo.points";
}, {
  capability: "tempo.write";
  domain: "tempo";
  fingerprintPrecondition: true;
  method: "removePoint";
  mutating: true;
  path: "tempo remove-point";
  takesParams: true;
  ungated: false;
  wire: "tempo.removePoint";
}, {
  capability: "tempo.write";
  domain: "tempo";
  fingerprintPrecondition: true;
  method: "set";
  mutating: true;
  path: "tempo set";
  takesParams: true;
  ungated: false;
  wire: "tempo.set";
}, {
  capability: "tempo.write";
  domain: "tempo";
  fingerprintPrecondition: false;
  method: "setDisplayRange";
  mutating: true;
  path: "tempo set-display-range";
  takesParams: true;
  ungated: false;
  wire: "tempo.setDisplayRange";
}, {
  capability: "tempo.write";
  domain: "tempo";
  fingerprintPrecondition: true;
  method: "setPoint";
  mutating: true;
  path: "tempo set-point";
  takesParams: true;
  ungated: false;
  wire: "tempo.setPoint";
}, {
  capability: "timesig.read";
  domain: "timesig";
  fingerprintPrecondition: false;
  method: "get";
  mutating: false;
  path: "timesig get";
  takesParams: false;
  ungated: false;
  wire: "timesig.get";
}, {
  capability: "timesig.read";
  domain: "timesig";
  fingerprintPrecondition: false;
  method: "list";
  mutating: false;
  path: "timesig list";
  takesParams: false;
  ungated: false;
  wire: "timesig.list";
}, {
  capability: "timesig.write";
  domain: "timesig";
  fingerprintPrecondition: true;
  method: "removeAt";
  mutating: true;
  path: "timesig remove-at";
  takesParams: true;
  ungated: false;
  wire: "timesig.removeAt";
}, {
  capability: "timesig.write";
  domain: "timesig";
  fingerprintPrecondition: true;
  method: "set";
  mutating: true;
  path: "timesig set";
  takesParams: true;
  ungated: false;
  wire: "timesig.set";
}, {
  capability: "timesig.write";
  domain: "timesig";
  fingerprintPrecondition: true;
  method: "setAt";
  mutating: true;
  path: "timesig set-at";
  takesParams: true;
  ungated: false;
  wire: "timesig.setAt";
}, {
  capability: "track.audition";
  domain: "track";
  fingerprintPrecondition: false;
  method: "auditionNote";
  mutating: true;
  path: "track audition note";
  takesParams: true;
  ungated: false;
  wire: "track.audition.note";
}, {
  capability: "track.audition";
  domain: "track";
  fingerprintPrecondition: false;
  method: "auditionNoteClear";
  mutating: true;
  path: "track audition note-clear";
  takesParams: true;
  ungated: false;
  wire: "track.audition.noteClear";
}, {
  capability: "track.audition";
  domain: "track";
  fingerprintPrecondition: false;
  method: "auditionNoteOff";
  mutating: true;
  path: "track audition note-off";
  takesParams: true;
  ungated: false;
  wire: "track.audition.noteOff";
}, {
  capability: "track.audition";
  domain: "track";
  fingerprintPrecondition: false;
  method: "auditionNoteOn";
  mutating: true;
  path: "track audition note-on";
  takesParams: true;
  ungated: false;
  wire: "track.audition.noteOn";
}, {
  capability: "track.write";
  domain: "track";
  fingerprintPrecondition: false;
  method: "create";
  mutating: true;
  path: "track create";
  takesParams: true;
  ungated: false;
  wire: "track.create";
}, {
  capability: "track.write";
  domain: "track";
  fingerprintPrecondition: false;
  method: "delete";
  mutating: true;
  path: "track delete";
  takesParams: true;
  ungated: false;
  wire: "track.delete";
}, {
  capability: "track.write";
  domain: "track";
  fingerprintPrecondition: false;
  method: "duplicate";
  mutating: true;
  path: "track duplicate";
  takesParams: true;
  ungated: false;
  wire: "track.duplicate";
}, {
  capability: "track.read";
  domain: "track";
  fingerprintPrecondition: false;
  method: "get";
  mutating: false;
  path: "track get";
  takesParams: true;
  ungated: false;
  wire: "track.get";
}, {
  capability: "track.read";
  domain: "track";
  fingerprintPrecondition: false;
  method: "list";
  mutating: false;
  path: "track list";
  takesParams: true;
  ungated: false;
  wire: "track.list";
}, {
  capability: "track.write";
  domain: "track";
  fingerprintPrecondition: false;
  method: "rename";
  mutating: true;
  path: "track rename";
  takesParams: true;
  ungated: false;
  wire: "track.rename";
}, {
  capability: "track.write";
  domain: "track";
  fingerprintPrecondition: false;
  method: "reorder";
  mutating: true;
  path: "track reorder";
  takesParams: true;
  ungated: false;
  wire: "track.reorder";
}, {
  capability: "track.read";
  domain: "track";
  fingerprintPrecondition: false;
  method: "resolve";
  mutating: false;
  path: "track resolve";
  takesParams: true;
  ungated: false;
  wire: "track.resolve";
}, {
  capability: "track.write";
  domain: "track";
  fingerprintPrecondition: false;
  method: "set";
  mutating: true;
  path: "track set";
  takesParams: true;
  ungated: false;
  wire: "track.set";
}, {
  capability: "track.write";
  domain: "track";
  fingerprintPrecondition: false;
  method: "setInput";
  mutating: true;
  path: "track set-input";
  takesParams: true;
  ungated: false;
  wire: "track.setInput";
}, {
  capability: "track.write";
  domain: "track";
  fingerprintPrecondition: false;
  method: "setLanguage";
  mutating: true;
  path: "track set-language";
  takesParams: true;
  ungated: false;
  wire: "track.setLanguage";
}, {
  capability: "transport.state";
  domain: "transport";
  fingerprintPrecondition: false;
  method: "loop";
  mutating: false;
  path: "transport loop";
  takesParams: false;
  ungated: false;
  wire: "transport.loop";
}, {
  capability: "transport.control";
  domain: "transport";
  fingerprintPrecondition: false;
  method: "metronome";
  mutating: true;
  path: "transport metronome";
  takesParams: true;
  ungated: false;
  wire: "transport.metronome";
}, {
  capability: "transport.control";
  domain: "transport";
  fingerprintPrecondition: false;
  method: "play";
  mutating: true;
  path: "transport play";
  takesParams: false;
  ungated: false;
  wire: "transport.play";
}, {
  capability: "transport.control";
  domain: "transport";
  fingerprintPrecondition: false;
  method: "seek";
  mutating: true;
  path: "transport seek";
  takesParams: true;
  ungated: false;
  wire: "transport.seek";
}, {
  capability: "transport.control";
  domain: "transport";
  fingerprintPrecondition: true;
  method: "setLoop";
  mutating: true;
  path: "transport set-loop";
  takesParams: true;
  ungated: false;
  wire: "transport.setLoop";
}, {
  capability: "transport.state";
  domain: "transport";
  fingerprintPrecondition: false;
  method: "state";
  mutating: false;
  path: "transport state";
  takesParams: false;
  ungated: false;
  wire: "transport.state";
}, {
  capability: "transport.control";
  domain: "transport";
  fingerprintPrecondition: false;
  method: "stop";
  mutating: true;
  path: "transport stop";
  takesParams: false;
  ungated: false;
  wire: "transport.stop";
}, {
  capability: "transport.control";
  domain: "transport";
  fingerprintPrecondition: false;
  method: "toggle";
  mutating: true;
  path: "transport toggle";
  takesParams: false;
  ungated: false;
  wire: "transport.toggle";
}, {
  capability: "ui.state";
  domain: "ui";
  fingerprintPrecondition: false;
  method: "get";
  mutating: false;
  path: "ui get";
  takesParams: false;
  ungated: false;
  wire: "ui.get";
}, {
  capability: "ui.control";
  domain: "ui";
  fingerprintPrecondition: false;
  method: "hidePanel";
  mutating: true;
  path: "ui hide-panel";
  takesParams: true;
  ungated: false;
  wire: "ui.hidePanel";
}, {
  capability: "ui.control";
  domain: "ui";
  fingerprintPrecondition: false;
  method: "hideSpecialTrack";
  mutating: true;
  path: "ui hide-special-track";
  takesParams: true;
  ungated: false;
  wire: "ui.hideSpecialTrack";
}, {
  capability: "ui.control";
  domain: "ui";
  fingerprintPrecondition: false;
  method: "hideWindow";
  mutating: true;
  path: "ui hide-window";
  takesParams: true;
  ungated: false;
  wire: "ui.hideWindow";
}, {
  capability: "ui.control";
  domain: "ui";
  fingerprintPrecondition: false;
  method: "showPanel";
  mutating: true;
  path: "ui show-panel";
  takesParams: true;
  ungated: false;
  wire: "ui.showPanel";
}, {
  capability: "ui.control";
  domain: "ui";
  fingerprintPrecondition: false;
  method: "showSpecialTrack";
  mutating: true;
  path: "ui show-special-track";
  takesParams: true;
  ungated: false;
  wire: "ui.showSpecialTrack";
}, {
  capability: "ui.control";
  domain: "ui";
  fingerprintPrecondition: false;
  method: "showWindow";
  mutating: true;
  path: "ui show-window";
  takesParams: true;
  ungated: false;
  wire: "ui.showWindow";
}, {
  capability: "vocalparam.read";
  domain: "vocalparam";
  fingerprintPrecondition: false;
  method: "layers";
  mutating: false;
  path: "vocalparam layers";
  takesParams: true;
  ungated: false;
  wire: "vocalparam.layers";
}, {
  capability: "vocalparam.read";
  domain: "vocalparam";
  fingerprintPrecondition: false;
  method: "read";
  mutating: false;
  path: "vocalparam read";
  takesParams: true;
  ungated: false;
  wire: "vocalparam.read";
}, {
  capability: "vocalparam.write";
  domain: "vocalparam";
  fingerprintPrecondition: true;
  method: "setVoicing";
  mutating: true;
  path: "vocalparam set-voicing";
  takesParams: true;
  ungated: false;
  wire: "vocalparam.setVoicing";
}, {
  capability: "vocalparam.read";
  domain: "vocalparam";
  fingerprintPrecondition: false;
  method: "voicing";
  mutating: false;
  path: "vocalparam voicing";
  takesParams: true;
  ungated: false;
  wire: "vocalparam.voicing";
}, {
  capability: "vocalparam.write";
  domain: "vocalparam";
  fingerprintPrecondition: true;
  method: "write";
  mutating: true;
  path: "vocalparam write";
  takesParams: true;
  ungated: false;
  wire: "vocalparam.write";
}, {
  capability: "voice.write";
  domain: "voice";
  fingerprintPrecondition: false;
  method: "collect";
  mutating: true;
  path: "voice collect";
  takesParams: true;
  ungated: false;
  wire: "voice.collect";
}, {
  capability: "voice.read";
  domain: "voice";
  fingerprintPrecondition: false;
  method: "community";
  mutating: false;
  path: "voice community";
  takesParams: true;
  ungated: false;
  wire: "voice.community";
}, {
  capability: "voice.read";
  domain: "voice";
  fingerprintPrecondition: false;
  method: "seeds";
  mutating: false;
  path: "voice seeds";
  takesParams: true;
  ungated: false;
  wire: "voice.seeds";
}, {
  capability: "voice.read";
  domain: "voice";
  fingerprintPrecondition: false;
  method: "synthModels";
  mutating: false;
  path: "voice synth-models";
  takesParams: true;
  ungated: false;
  wire: "voice.synthModels";
}];
```

Every operation in this artifact, sorted by path.
