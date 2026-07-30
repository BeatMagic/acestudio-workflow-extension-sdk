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

Dockable panels, keyed by the selector `ui show-panel` takes.

#### fx

```ts
fx: {
  animating: boolean;
  visible: boolean;
};
```

The track-config / FX panel for the selected track.

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

The mixer panel: track volume, pan, mute, solo, and effect controls.

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

The MV creator panel. Shares one slot with `v2m` - see `sharedPanelSlot`.

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

The video-composer (V2M) panel. Shares one slot with `mv` - see `sharedPanelSlot`.

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
  selected: "mv" | "v2m";
};
```

The one slot `mv` and `v2m` take turns holding: showing one closes the other.

#### open

```ts
open: boolean;
```

Whether the slot is on screen. `panels.\<selected\>.visible` is this flag; the other member is always hidden.

#### selected

```ts
selected: "mv" | "v2m";
```

Which of the two currently holds the slot. Survives the slot closing, so it is also which one a bare re-open would show.

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

Arrangement-view special-track rows, keyed by the selector `ui show-special-track` takes.

#### chord

```ts
chord: {
  animating: boolean;
  visible: boolean;
};
```

The chord progression row.

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

The combined tempo and time-signature rows (they toggle together).

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

Tool windows, keyed by the selector `ui show-window` takes.

#### video-monitor

```ts
video-monitor: {
  animating: boolean;
  visible: boolean;
};
```

The floating video-monitor window.

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
