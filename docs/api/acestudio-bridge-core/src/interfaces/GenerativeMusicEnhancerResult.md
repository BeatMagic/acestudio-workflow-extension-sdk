# Interface: GenerativeMusicEnhancerResult

Success payload of `generative music-enhancer`.

## Properties

### cancellable

```ts
cancellable: boolean;
```

Whether `job cancel` will be honored. Always false here: the server-side kit has no in-flight cancel.

***

### delivery

```ts
delivery: string;
```

How this class delivers results. Always "staged": results land in the session history for audition and reach the project only through `job place`.

***

### from

```ts
from: number;
```

Tick position the enhanced region starts at — the arrangement selection's begin at launch.

***

### jobClass

```ts
jobClass: string;
```

The job class, as `job get` reports it: "music-enhancer".

***

### jobId

```ts
jobId: string;
```

The launched job's id. Present on every successful launch — nothing has been generated when this returns.

***

### streamingCapable?

```ts
optional streamingCapable?: boolean;
```

True when results of this class can enter the `streaming` state — playable while still growing, and placeable before they settle.

***

### to

```ts
to: number;
```

Tick position the enhanced region ends at (exclusive).

***

### trackUuids

```ts
trackUuids: string[];
```

The tracks whose audio fed the enhancement, in arrangement order, as braced UUIDs.
