# Interface: AudioPluginEditorOpenResult

Success payload of `audio-plugin editor open`.

## Properties

### alreadyOpen

```ts
alreadyOpen: boolean;
```

True when the editor was already open — a window on screen, or a built-in's body expanded on the shown panel — and the call raised or scrolled to it rather than opening it.

***

### instanceId

```ts
instanceId: string;
```

Instance id of the plugin whose editor was opened.

***

### name?

```ts
optional name?: string;
```

The name shown for that plugin.

***

### revealed

```ts
revealed: boolean;
```

True when the call moved the user's view to put the editor on screen: a window off the caret's chain had the caret — and the selection that moves with it — moved onto its track, or a built-in's body had the FX panel brought there and its Fx tab selected. False when nothing had to move: the editor was already open, or already on the caret's track with the panel showing it.
