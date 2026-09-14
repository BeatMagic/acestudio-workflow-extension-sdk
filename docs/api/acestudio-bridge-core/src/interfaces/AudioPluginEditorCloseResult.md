# Interface: AudioPluginEditorCloseResult

Success payload of `audio-plugin editor close`.

## Properties

### alreadyClosed

```ts
alreadyClosed: boolean;
```

True when the close found nothing to do: no remembered-open state to clear and no body on screen to collapse — for a window, an editor whose memory is already gone, no window ever built included; for a built-in, a body already collapsed on the panel showing its chain, or a panel hidden or on another tab. An editor the caret is away from may refuse instead (`EDITOR_PARKED`, see `force`); this result covers the cases that do not. `alreadyOpen`'s twin: the state the caller asked for is the state the plugin is in, which is a success, not an error to invent.

***

### instanceId

```ts
instanceId: string;
```

Instance id of the plugin whose editor was closed.

***

### name?

```ts
optional name?: string;
```

The name shown for that plugin.
