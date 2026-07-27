# Interface: SpecialTracksGetResult

Success payload of `special-tracks get`.

## Properties

### chord

```ts
chord: object;
```

Visibility state of the chord progression track.

#### animating

```ts
animating: boolean;
```

Whether the track is mid-animation (opening or closing).

#### visible

```ts
visible: boolean;
```

Whether the track is currently shown.

***

### tempo\_and\_timesig

```ts
tempo_and_timesig: object;
```

Visibility state of the combined tempo and time-signature tracks (toggled together in the UI).

#### animating

```ts
animating: boolean;
```

Whether the track is mid-animation (opening or closing).

#### visible

```ts
visible: boolean;
```

Whether the track is currently shown.
