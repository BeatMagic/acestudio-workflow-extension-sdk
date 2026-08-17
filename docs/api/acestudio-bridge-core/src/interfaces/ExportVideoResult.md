# Interface: ExportVideoResult

Success payload of `export video`.

## Properties

### cancellable?

```ts
optional cancellable?: boolean;
```

Whether `job cancel` will be honored for this job.

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

The job class, as `job get` reports it: always "export-video".

***

### jobId

```ts
jobId: string;
```

The launched job's id. Pass it to `job get` / `job wait` / `job cancel`.

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

Frame width the render will produce, after the composition canvas and any override are resolved.
