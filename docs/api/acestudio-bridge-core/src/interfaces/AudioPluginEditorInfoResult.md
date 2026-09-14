# Interface: AudioPluginEditorInfoResult

Success payload of `audio-plugin editor info`.

## Properties

### instanceId

```ts
instanceId: string;
```

Instance id of the plugin whose editor was read.

***

### kind

```ts
kind: "inline" | "vendor" | "generic" | "unavailable";
```

What a plugin editor actually is — the surface, not its container. Every plugin has one; this says which.

***

### name?

```ts
optional name?: string;
```

The name shown for that plugin.

***

### open

```ts
open: boolean;
```

True when the editor is up on a surface the runtime can reach — on screen, whichever kind. For an external plugin: its window is on screen right now, which is the editor's track remembering it open AND that track being the caret's, since a caret move to another track parks the window and keeps the memory. For a built-in: its body is expanded AND the FX panel is showing that insert — the panel shows one track's chain at a time, so an expanded body on another track is not open. Scroll position within the panel does not enter into it. The one precondition every editor atom has; the remedy when false is always `editor open`.

***

### parked

```ts
parked: boolean;
```

True when the editor is PARKED: its track remembers it open, and the caret is on another track, so nothing is on screen for it and moving the caret back is what brings it up again (ADR 0152 §2). Reported, never gated on. It sits beside `open` to answer a different question — not *may I act here*, which is `open` alone, but *why is this editor not on screen*. The atoms keep `open` as their single precondition and `EDITOR_NOT_OPEN` as their single refusal, so no recipe branches on this (ADR 0148 §2). A state of the EDITOR rather than of a window: a project that loads with an editor remembered open reports `parked` from the moment it loads, before any window exists. The master is a track here like any other. Never true beside `open`. What it separates is an editor the user parked from one nobody ever opened, which both read `open: false`. Always false for a built-in's inline body (`kind: inline`). Parked takes an editor its track remembers open, and a built-in has no such memory: a chip's body is expanded unless someone collapsed it, so the only rule available would read true for every uncollapsed insert off the caret — nearly all of them — which reports where the caret is and not anything about the editor. Nor is there a vanished editor to explain: the FX panel shows the caret's track by construction, so a built-in's body is where its insert is, and `open` alone already says whether it is on screen.

***

### resizable?

```ts
optional resizable?: boolean;
```

Whether the editor can be resized: what a vendor view declares, free resize for Studio's own pages, and false for a built-in's body, which takes the panel's width. Absent while the editor is not open.

***

### scale?

```ts
optional scale?: number;
```

Physical pixels per logical point on the screen the editor is on, so a capture's pixel coordinates divide back to gesture coordinates. Absent while the editor is not open.

***

### size?

```ts
optional size?: {
  height: number;
  width: number;
};
```

A size in logical points — the one unit every editor reading on this surface uses, whatever the platform sizes the plugin's native view in. On Windows the view is physical pixels and the host divides by the display scale before the number reaches here.

#### height

```ts
height: number;
```

#### width

```ts
width: number;
```

***

### sizeConstraints?

```ts
optional sizeConstraints?: {
  aspectRatio?: number;
  maxHeight: number;
  maxWidth: number;
  minHeight: number;
  minWidth: number;
};
```

The bounds the host holds a plugin's editor window to, in logical points: what the plugin declares, with the maximum capped at what the screen the window is on can realize, and the host's own bounds where the plugin declares none. A fixed-size editor reports `min == max == size`.

#### aspectRatio?

```ts
optional aspectRatio?: number;
```

The plugin's declared width:height, when it declares one. Absent when the editor is free to take any proportion.

#### maxHeight

```ts
maxHeight: number;
```

#### maxWidth

```ts
maxWidth: number;
```

#### minHeight

```ts
minHeight: number;
```

#### minWidth

```ts
minWidth: number;
```
