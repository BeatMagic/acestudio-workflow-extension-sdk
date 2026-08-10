# Interface: ExportVideoResult

Success payload of `export video`.

## Properties

### cancellable?

```ts
optional cancellable?: boolean;
```

Whether `job cancel` will be honored for this job. False means a cancel returns JOB_NOT_CANCELLABLE rather than pretending.

***

### fps?

```ts
optional fps?: number;
```

Frame rate the render will produce.

***

### height?

```ts
optional height?: number;
```

Frame height the render will produce.

***

### jobClass?

```ts
optional jobClass?: string;
```

The job class, as `job get` reports it: 'export-audio' or 'export-video'.

***

### jobId

```ts
jobId: string;
```

The launched job's id. Pass it to `job get` / `job wait` / `job cancel`. Present on every successful launch -- the render has NOT finished when this returns.

***

### path

```ts
path: string;
```

Where the rendered video will land. The file does not exist yet.

***

### width?

```ts
optional width?: number;
```

Frame width the render will produce, after the composition canvas and any --width/--height override are resolved.
