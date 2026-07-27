# Interface: EditorTickRangeResult

Success payload of `editor tick-range`.

## Properties

### tickBegin

```ts
tickBegin: number;
```

Editor start position in global ticks; the offset for local-to-global conversion.

***

### tickEnd

```ts
tickEnd: number;
```

Editor end position in global ticks. Always greater than tickBegin.
