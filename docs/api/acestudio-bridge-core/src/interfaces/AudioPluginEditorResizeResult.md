# Interface: AudioPluginEditorResizeResult

Success payload of `audio-plugin editor resize`.

## Properties

### instanceId

```ts
instanceId: string;
```

Instance id of the plugin whose editor was resized.

***

### name?

```ts
optional name?: string;
```

The name shown for that plugin.

***

### previousSize

```ts
previousSize: {
  height: number;
  width: number;
};
```

A size in logical points — the one unit every editor reading on this surface uses, whatever the platform sizes the plugin's native view in. On Windows the view is physical pixels and the host divides by the display scale before the number reaches here.

#### height

```ts
height: number;
```

#### width

```ts
width: number;
```

***

### size

```ts
size: {
  height: number;
  width: number;
};
```

A size in logical points — the one unit every editor reading on this surface uses, whatever the platform sizes the plugin's native view in. On Windows the view is physical pixels and the host divides by the display scale before the number reaches here.

#### height

```ts
height: number;
```

#### width

```ts
width: number;
```
