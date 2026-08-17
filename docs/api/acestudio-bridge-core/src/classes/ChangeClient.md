# Class: ChangeClient

## Constructors

### Constructor

```ts
new ChangeClient(peer): ChangeClient;
```

#### Parameters

##### peer

[`ChangePeer`](../interfaces/ChangePeer.md)

#### Returns

`ChangeClient`

## Methods

### onAuthChanged()

```ts
onAuthChanged(callback): Unsubscribe;
```

The access token was replaced, or a refresh failed. A peer re-fetches with
`auth get-token`. The token never rides the notification: a fresh credential
pushed to every subscriber is a copy of a secret in more places than the one
peer that asked for it.

#### Parameters

##### callback

(`event`) => `void`

#### Returns

[`Unsubscribe`](../type-aliases/Unsubscribe.md)

***

### onCanvasChanged()

```ts
onCanvasChanged(callback): Unsubscribe;
```

The canvas changed — the authored setting, or the effective raster the
compositor adopted after an adaptive re-derivation (ADR 0066). Which of the
two moved is not reported, because the host signal does not say: a peer
re-fetches with `canvas info`, `canvas effective-size`, or both.

#### Parameters

##### callback

(`event`) => `void`

#### Returns

[`Unsubscribe`](../type-aliases/Unsubscribe.md)

***

### onClipsChanged()

```ts
onClipsChanged(callback): Unsubscribe;
```

A clip was added, removed, moved, trimmed, renamed, muted, or recoloured.
`changes` carries the affected clip uuids. A peer re-fetches with `clip list`,
which needs a track to address, so a uuid here names the clip and the peer
reads the track it was told about on `tracks.changed`.

#### Parameters

##### callback

(`event`) => `void`

#### Returns

[`Unsubscribe`](../type-aliases/Unsubscribe.md)

***

### onContextAudioChanged()

```ts
onContextAudioChanged(callback): Unsubscribe;
```

The session's context-audio export started, finished, or failed. A peer
re-fetches with `context-audio get`.

#### Parameters

##### callback

(`event`) => `void`

#### Returns

[`Unsubscribe`](../type-aliases/Unsubscribe.md)

***

### onJobsChanged()

```ts
onJobsChanged(callback): Unsubscribe;
```

The job ledger (ADR 0084): a job's lifecycle or result transition. `changes`
carries the affected job ids.

#### Parameters

##### callback

(`event`) => `void`

#### Returns

[`Unsubscribe`](../type-aliases/Unsubscribe.md)

***

### onMonitorChanged()

```ts
onMonitorChanged(callback): Unsubscribe;
```

The video Monitor stream came up, renegotiated, or went down. A peer
re-fetches with `monitor stream-info` — the same call that BRINGS the stream
up (ADR 0038), which is what a peer subscribed here wants, since it is
attached to the monitor. Silent before login: the stream belongs to an MV
session, so until one is up there is nothing to report.

#### Parameters

##### callback

(`event`) => `void`

#### Returns

[`Unsubscribe`](../type-aliases/Unsubscribe.md)

***

### onMvupdateChanged()

```ts
onMvupdateChanged(callback): Unsubscribe;
```

The MV runtime's update standing moved (checking, available, downloading,
failed). A peer re-fetches with `update status`. Named for its token's domain
rather than after the verb, because the subject is one peer's updater and a
bare `update` would collide with the next peer that wants one.

#### Parameters

##### callback

(`event`) => `void`

#### Returns

[`Unsubscribe`](../type-aliases/Unsubscribe.md)

***

### onProjectChanged()

```ts
onProjectChanged(callback): Unsubscribe;
```

The open project changed identity or location: opened, closed, or its session
folder relocated within the same session (Save-As / temp promotion, never a
project switch — ADR 0026/0027). A peer re-fetches with `project info`.

#### Parameters

##### callback

(`event`) => `void`

#### Returns

[`Unsubscribe`](../type-aliases/Unsubscribe.md)

***

### onSelectionChanged()

```ts
onSelectionChanged(callback): Unsubscribe;
```

The arrangement selection moved: the selected tracks, the time range, or both.
`changes` carries `tracks` and `range`. A peer re-fetches with `selection get`.

#### Parameters

##### callback

(`event`) => `void`

#### Returns

[`Unsubscribe`](../type-aliases/Unsubscribe.md)

***

### onTempoChanged()

```ts
onTempoChanged(callback): Unsubscribe;
```

The tempo curve changed — a point added, moved, bent, or removed, or the whole
curve replaced by a beat-analysis apply. A peer re-fetches with `tempo get`
for the single-tempo view or `tempo points` for the curve.

#### Parameters

##### callback

(`event`) => `void`

#### Returns

[`Unsubscribe`](../type-aliases/Unsubscribe.md)

***

### onTracksChanged()

```ts
onTracksChanged(callback): Unsubscribe;
```

A track was added, removed, reordered, renamed, or had a mixer property
change — in the arrangement or in either pinned band (ADR 0104). `changes`
carries the affected track uuids. A peer re-fetches with `track list`.

#### Parameters

##### callback

(`event`) => `void`

#### Returns

[`Unsubscribe`](../type-aliases/Unsubscribe.md)

***

### onTransportChanged()

```ts
onTransportChanged(callback): Unsubscribe;
```

Transport moved: play, stop, a user seek, or the loop region. `changes`
carries `playing`, `position`, `loop`. Transitions only — the continuous
playback position is deliberately not a subject here, because a re-fetch per
frame is what the coalescing cannot save; a throttled position feed is its own
mechanism. A peer re-fetches with `transport state`.

#### Parameters

##### callback

(`event`) => `void`

#### Returns

[`Unsubscribe`](../type-aliases/Unsubscribe.md)

***

### onUiChanged()

```ts
onUiChanged(callback): Unsubscribe;
```

Studio chrome: a panel, tool window, or arrangement-view row was shown or
hidden. `changes` carries the affected citizens as their paths in the `ui get`
payload — `panels.mixer`, `specialTracks.chord`, `windows.video-monitor` —
plus `sharedPanelSlot.selected` when MV and V2M swap the slot without either
becoming visible. A peer re-fetches with `ui get`.

#### Parameters

##### callback

(`event`) => `void`

#### Returns

[`Unsubscribe`](../type-aliases/Unsubscribe.md)
