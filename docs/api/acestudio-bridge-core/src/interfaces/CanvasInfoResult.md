# Interface: CanvasInfoResult

Success payload of `canvas info`.

## Properties

### adaptive

```ts
adaptive: boolean;
```

True when the canvas resolution follows Studio's anchor-clip derivation (ADR 0059 §3–5); false when it is an explicit authored size.

***

### frameRate

```ts
frameRate: number;
```

Frames per second. Independent axis — never adaptive (ADR 0059); default 30.

***

### height?

```ts
optional height?: number;
```

Authored pixel height — present iff `!adaptive`.

***

### width?

```ts
optional width?: number;
```

Authored pixel width — present iff `!adaptive`.
