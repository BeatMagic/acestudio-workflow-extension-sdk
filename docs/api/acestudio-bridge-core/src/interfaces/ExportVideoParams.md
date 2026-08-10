# Interface: ExportVideoParams

Arguments for `export video`.

## Properties

### bitRate?

```ts
optional bitRate?: number | null;
```

Video bit rate in kbps. Omit for the encoder's default for the resolved geometry.

***

### fps?

```ts
optional fps?: number | null;
```

Frame rate. Omit for the composition canvas's frame rate.

***

### from?

```ts
optional from?: number | null;
```

Where the rendered range starts. Omit for the top of the project.

***

### height?

```ts
optional height?: number | null;
```

Frame height in pixels. Omit for the composition canvas's height.

***

### path

```ts
path: string;
```

Where to write the rendered video.

***

### to?

```ts
optional to?: number | null;
```

Where the rendered range ends (exclusive). Omit for the end of the project's content.

***

### width?

```ts
optional width?: number | null;
```

Frame width in pixels. Omit for the composition canvas's width.
