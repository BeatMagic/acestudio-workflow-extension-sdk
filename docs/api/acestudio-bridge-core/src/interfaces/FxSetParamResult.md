# Interface: FxSetParamResult

Success payload of `fx set-param`.

## Properties

### insertId

```ts
insertId: string;
```

Instance id of the insert that was written.

***

### param

```ts
param: {
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
};
```

One parameter with its value: what `fx get-params` answers with. The same shape as `ParameterMeta` plus what a read is for.

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

Stable id to pass to `fx set-param`.

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

Current value, normalized to 0..1 — the same scale `fx set-param` takes.

#### valueText

```ts
valueText: string;
```

The plugin's own rendering of the current value, units included (`-12.3 dB`). Display only; never parse it back.
