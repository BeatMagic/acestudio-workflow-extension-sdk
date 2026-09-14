# Interface: MidiparamListLanesResult

Success payload of `midiparam list-lanes`.

## Properties

### clipUuid

```ts
clipUuid: string;
```

The clip the listing describes.

***

### laneCount

```ts
laneCount: number;
```

Number of entries in `lanes` (convenience field).

***

### lanes

```ts
lanes: {
  controller?: number;
  count: number;
  key: string;
  name?: string;
}[];
```

Every controller lane with at least one anchor, in ascending controller order, plus the `velocity` row, which is always present. A lane missing here is empty: its controller is untouched and a read of it reports the controller's default.

#### controller?

```ts
optional controller?: number;
```

MIDI controller number, 0-127; 128 for pitch bend. Absent on the `velocity` row, which is not a controller.

#### count

```ts
count: number;
```

Anchors in the lane; on the `velocity` row, the clip's note count.

#### key

```ts
key: string;
```

Lane key — `cc\<N\>` (0-127), `pitchbend`, or `velocity`. The key the lane verbs take as `--lane`; `velocity` is listed for discovery but is per-note, so the lane verbs refuse it.

#### name?

```ts
optional name?: string;
```

The controller's standard MIDI name (e.g. `Modulation`), untranslated — MIDI-spec terms are the ones DAWs keep in English across locales. `Pitch Bend` and `Velocity` on those rows. Absent for a controller the specification leaves undefined.
