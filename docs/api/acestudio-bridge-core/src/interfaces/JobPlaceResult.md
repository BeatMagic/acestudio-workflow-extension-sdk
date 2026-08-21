# Interface: JobPlaceResult

Success payload of `job place`.

## Properties

### region?

```ts
optional region?: string;
```

Which index space `trackIndex` counts in. Always `arrangement`, which is the only region a placement can reach.

***

### resultId

```ts
resultId: string;
```

The staged result that was placed.

***

### trackIndex?

```ts
optional trackIndex?: number;
```

0-based position of that track in `region` — the identity the UI shows a person, beside the handle a program stores (ADR 0129 §3). Absent together with `region` when the project cannot place the track, which is an inconsistency rather than anything a caller did.

***

### trackUuid

```ts
trackUuid: string;
```

UUID of the track it was placed on, with braces.
