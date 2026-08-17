# Interface: CaretGetResult

Success payload of `caret get`.

## Properties

### focus

```ts
focus: string;
```

Which UI area holds caret focus: `arrangement` (track view) or `editor` (pattern editor). Folded in from the retired `marker get-focus`, because a caret position without the view that owns it is ambiguous.

***

### scope

```ts
scope: string;
```

The scope actually used — `global` or `editor`. `arrangement` normalizes to `global`, so the answer names one of the two the caret really has.

***

### tick

```ts
tick: number;
```

Caret position in ticks: global ticks under `global` scope, ticks local to the open clip under `editor` scope.

***

### trackIndex

```ts
trackIndex: number;
```

0-based track index of the caret. Users see tracks starting from 1.
