# Interface: CaretGetResult

Success payload of `caret get`.

## Properties

### focus

```ts
focus: string;
```

Which UI area currently holds caret focus: 'arrangement' (track view) or 'editor' (pattern editor).

***

### scope

```ts
scope: string;
```

The scope actually used: 'global' or 'editor' ('arrangement' is normalized to 'global').

***

### tick

```ts
tick: number;
```

Caret position in ticks: global ticks for 'global' scope, local ticks inside the open clip for 'editor' scope.

***

### trackIndex

```ts
trackIndex: number;
```

0-based track index of the caret. Users see tracks starting from 1.
