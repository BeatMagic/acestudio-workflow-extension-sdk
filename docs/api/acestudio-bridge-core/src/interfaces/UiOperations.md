# Interface: UiOperations

The `ui` operations, mirroring the canonical operation tree 1:1, and the subscription that reports when the subject changes.

## Methods

### get()

```ts
get(options?): Promise<UiGetResult>;
```

Read the state of every Studio chrome citizen: panels, tool windows, and special-track rows.

Requires the `ui.state` capability.

#### Parameters

##### options?

[`CallOptions`](CallOptions.md)

#### Returns

`Promise`\<[`UiGetResult`](UiGetResult.md)\>

***

### hidePanel()

```ts
hidePanel(params, options?): Promise<void>;
```

Hide a dockable panel (mixer, fx, mv, v2m).

Requires the `ui.control` capability.

#### Parameters

##### params

[`UiHidePanelParams`](UiHidePanelParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<`void`\>

***

### hideSpecialTrack()

```ts
hideSpecialTrack(params, options?): Promise<void>;
```

Hide an arrangement-view special-track row (chord, tempo_and_timesig).

Requires the `ui.control` capability.

#### Parameters

##### params

[`UiHideSpecialTrackParams`](UiHideSpecialTrackParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<`void`\>

***

### hideWindow()

```ts
hideWindow(params, options?): Promise<void>;
```

Hide a tool window (video-monitor).

Requires the `ui.control` capability.

#### Parameters

##### params

[`UiHideWindowParams`](UiHideWindowParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<`void`\>

***

### onChanged()

```ts
onChanged(listener): Unsubscribe;
```

Studio chrome (spec 1501 §4): a panel, tool window, or arrangement-view row
was shown or hidden. `changes` carries the affected citizens as their paths
in the `ui get` payload — `panels.mixer`, `specialTracks.chord`,
`windows.video-monitor` — plus `sharedPanelSlot.selected` when MV and V2M
swap the slot without either becoming visible. A peer re-fetches with
`ui get`.

Listen for changes on the `ui` channel. The event is a hint to re-read, not the new state.

Requires the `ui.state` capability — an ungranted subscription is refused at this call, not silently never delivered.

#### Parameters

##### listener

(`event`) => `void`

#### Returns

[`Unsubscribe`](../type-aliases/Unsubscribe.md)

***

### showPanel()

```ts
showPanel(params, options?): Promise<void>;
```

Show a dockable panel (mixer, fx, mv, v2m). Showing mv or v2m closes the other.

Requires the `ui.control` capability.

#### Parameters

##### params

[`UiShowPanelParams`](UiShowPanelParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<`void`\>

***

### showSpecialTrack()

```ts
showSpecialTrack(params, options?): Promise<void>;
```

Show an arrangement-view special-track row (chord, tempo_and_timesig).

Requires the `ui.control` capability.

#### Parameters

##### params

[`UiShowSpecialTrackParams`](UiShowSpecialTrackParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<`void`\>

***

### showWindow()

```ts
showWindow(params, options?): Promise<void>;
```

Show a tool window (video-monitor).

Requires the `ui.control` capability.

#### Parameters

##### params

[`UiShowWindowParams`](UiShowWindowParams.md)

##### options?

[`MutatingCallOptions`](MutatingCallOptions.md)

#### Returns

`Promise`\<`void`\>
