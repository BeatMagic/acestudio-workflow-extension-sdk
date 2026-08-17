# Interface: UiGetResult

Success payload of `ui get`.

## Properties

### panels

```ts
panels: {
  fx: {
     animating: boolean;
     visible: boolean;
  };
  mixer: {
     animating: boolean;
     visible: boolean;
  };
  mv: {
     animating: boolean;
     visible: boolean;
  };
  v2m: {
     animating: boolean;
     visible: boolean;
  };
};
```

Dockable panels — the roster `ui show-panel` / `ui hide-panel` take a member of.

#### fx

```ts
fx: {
  animating: boolean;
  visible: boolean;
};
```

One chrome citizen's reportable state. The visible/animating split matters: these transitions are animated and the open flag flips at the *start* of the animation, so `visible: true, animating: true` means "opening", not "open".

##### fx.animating

```ts
animating: boolean;
```

Whether it is mid-transition (opening or closing).

##### fx.visible

```ts
visible: boolean;
```

Whether the citizen is currently on screen.

#### mixer

```ts
mixer: {
  animating: boolean;
  visible: boolean;
};
```

One chrome citizen's reportable state. The visible/animating split matters: these transitions are animated and the open flag flips at the *start* of the animation, so `visible: true, animating: true` means "opening", not "open".

##### mixer.animating

```ts
animating: boolean;
```

Whether it is mid-transition (opening or closing).

##### mixer.visible

```ts
visible: boolean;
```

Whether the citizen is currently on screen.

#### mv

```ts
mv: {
  animating: boolean;
  visible: boolean;
};
```

One chrome citizen's reportable state. The visible/animating split matters: these transitions are animated and the open flag flips at the *start* of the animation, so `visible: true, animating: true` means "opening", not "open".

##### mv.animating

```ts
animating: boolean;
```

Whether it is mid-transition (opening or closing).

##### mv.visible

```ts
visible: boolean;
```

Whether the citizen is currently on screen.

#### v2m

```ts
v2m: {
  animating: boolean;
  visible: boolean;
};
```

One chrome citizen's reportable state. The visible/animating split matters: these transitions are animated and the open flag flips at the *start* of the animation, so `visible: true, animating: true` means "opening", not "open".

##### v2m.animating

```ts
animating: boolean;
```

Whether it is mid-transition (opening or closing).

##### v2m.visible

```ts
visible: boolean;
```

Whether the citizen is currently on screen.

***

### sharedPanelSlot

```ts
sharedPanelSlot: {
  open: boolean;
  selected: string;
};
```

The one slot `mv` and `v2m` take turns holding: showing one closes the other.

#### open

```ts
open: boolean;
```

Whether the slot is on screen. `panels.\<selected\>.visible` mirrors this flag; the other member of the pair is always hidden.

#### selected

```ts
selected: string;
```

Which of `mv` / `v2m` currently holds the slot. Survives the slot closing, so it is also which one a bare re-open would show.

***

### specialTracks

```ts
specialTracks: {
  chord: {
     animating: boolean;
     visible: boolean;
  };
  tempo_and_timesig: {
     animating: boolean;
     visible: boolean;
  };
};
```

Arrangement-view special-track rows — the roster `ui show-special-track` / `ui hide-special-track` take a member of.

#### chord

```ts
chord: {
  animating: boolean;
  visible: boolean;
};
```

One chrome citizen's reportable state. The visible/animating split matters: these transitions are animated and the open flag flips at the *start* of the animation, so `visible: true, animating: true` means "opening", not "open".

##### chord.animating

```ts
animating: boolean;
```

Whether it is mid-transition (opening or closing).

##### chord.visible

```ts
visible: boolean;
```

Whether the citizen is currently on screen.

#### tempo\_and\_timesig

```ts
tempo_and_timesig: {
  animating: boolean;
  visible: boolean;
};
```

One chrome citizen's reportable state. The visible/animating split matters: these transitions are animated and the open flag flips at the *start* of the animation, so `visible: true, animating: true` means "opening", not "open".

##### tempo\_and\_timesig.animating

```ts
animating: boolean;
```

Whether it is mid-transition (opening or closing).

##### tempo\_and\_timesig.visible

```ts
visible: boolean;
```

Whether the citizen is currently on screen.

***

### windows

```ts
windows: {
  video-monitor: {
     animating: boolean;
     visible: boolean;
  };
};
```

Tool windows — the roster `ui show-window` / `ui hide-window` take a member of.

#### video-monitor

```ts
video-monitor: {
  animating: boolean;
  visible: boolean;
};
```

One chrome citizen's reportable state. The visible/animating split matters: these transitions are animated and the open flag flips at the *start* of the animation, so `visible: true, animating: true` means "opening", not "open".

##### video-monitor.animating

```ts
animating: boolean;
```

Whether it is mid-transition (opening or closing).

##### video-monitor.visible

```ts
visible: boolean;
```

Whether the citizen is currently on screen.
