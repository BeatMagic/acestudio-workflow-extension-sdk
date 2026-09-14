# Interface: AudioPluginEditorTypeParams

Arguments for `audio-plugin editor type`.

## Properties

### charDelayMs?

```ts
optional charDelayMs?: number;
```

Milliseconds to let the editor run between characters. Default 0, which still yields one event-loop turn per character.

***

### instance?

```ts
optional instance?: string;
```

Instance id of a CHAIN insert, as `fx list` reports it.

***

### rack?

```ts
optional rack?: "pre";
```

Which master rack a result came from. Present on every master-addressed result and on none of the track ones, so a reader can tell the two apart without inspecting `trackUuid`. Only `pre` occurs — see `Fx.acerpc`.

***

### region?

```ts
optional region?: string;
```

Which index space `trackIndex` counts in: `arrangement` (the default), `video` or `marker`. Ignored beside `trackUuid`.

***

### slot?

```ts
optional slot?: string;
```

A 0-based chain position as a decimal string, or the reserved word `instrument`. Mutually exclusive with `instance`; the `fx` presentations refuse the keyword.

***

### text

```ts
text: string;
```

What to type. Every character goes as itself; a newline is not a `return` — use `editor key` for named keys.

***

### timeoutMs?

```ts
optional timeoutMs?: number;
```

Milliseconds before the atom gives up with `TIMEOUT`. Default 10000.

***

### trackIndex?

```ts
optional trackIndex?: number;
```

0-based position in `region`. Mutually exclusive with `trackUuid`.

***

### trackUuid?

```ts
optional trackUuid?: string;
```

Track UUID in braces format, or `master` for the master bus.
