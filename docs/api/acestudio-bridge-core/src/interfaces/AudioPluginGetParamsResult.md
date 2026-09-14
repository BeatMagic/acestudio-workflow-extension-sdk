# Interface: AudioPluginGetParamsResult

Success payload of `audio-plugin get-params`.

## Properties

### filter?

```ts
optional filter?: string;
```

The `filter` pattern this answer was narrowed by.

***

### fingerprint

```ts
fingerprint: Fingerprint;
```

Content fingerprint of this plugin's parameter state. Carry it back as the reserved `fingerprint` argument on `audio-plugin set-param` or `audio-plugin apply-preset` to fail STALE_WRITE instead of overwriting edits made since this read. Covers the plugin's whole parameter state whether or not `filter` narrowed the list, because that is what the write it guards can disturb.

***

### instanceId

```ts
instanceId: string;
```

Instance id of the plugin that was read. The instrument slot carries one like any insert — session-scoped, so store the `slot` keyword, not this.

***

### name?

```ts
optional name?: string;
```

The name shown for that plugin.

***

### paramCount

```ts
paramCount: number;
```

Number of entries in `params` — after `filter`, if one was given.

***

### params

```ts
params: {
  automatable: boolean;
  choices?: string[];
  defaultValue?: number;
  group?: string;
  index: number;
  kind: "boolean" | "continuous" | "stepped" | "choice";
  max?: number;
  min?: number;
  name: string;
  paramId: string;
  stepCount?: number;
  unit?: string;
  value: number;
  valueText: string;
}[];
```

The parameters, in the plugin's own order — every one the plugin exposes unless `filter` narrowed them.

#### automatable

```ts
automatable: boolean;
```

Whether an automation lane may drive this parameter.

#### choices?

```ts
optional choices?: string[];
```

Option names, for a `choice` parameter.

#### defaultValue?

```ts
optional defaultValue?: number;
```

The parameter's default, normalized to 0..1.

#### group?

```ts
optional group?: string;
```

The plugin's own grouping for this parameter, when it declares one.

#### index

```ts
index: number;
```

The plugin's own parameter index. Informational — writes address the id.

#### kind

```ts
kind: "boolean" | "continuous" | "stepped" | "choice";
```

What shape a parameter's range has, and so what a value means.

#### max?

```ts
optional max?: number;
```

High end of the range in the plugin's own units.

#### min?

```ts
optional min?: number;
```

Low end of the range in the plugin's own units.

#### name

```ts
name: string;
```

Display name of the parameter.

#### paramId

```ts
paramId: string;
```

Stable id to pass to `audio-plugin set-param`.

#### stepCount?

```ts
optional stepCount?: number;
```

Number of steps between the ends, for a `stepped` parameter.

#### unit?

```ts
optional unit?: string;
```

The parameter's unit label (`dB`, `Hz`, `%`), when it has one.

#### value

```ts
value: number;
```

Current value, normalized to 0..1 — the same scale `audio-plugin set-param` takes.

#### valueText

```ts
valueText: string;
```

The plugin's own rendering of the current value, units included (`-12.3 dB`). The plugin formats it however it likes, so there is no format to parse a value back out of — hand it back to `audio-plugin set-param` as `display` instead, and the host does the reading.

***

### totalParamCount

```ts
totalParamCount: number;
```

How many parameters the plugin exposes in total.

***

### typeId?

```ts
optional typeId?: string;
```

Which plugin it is.
