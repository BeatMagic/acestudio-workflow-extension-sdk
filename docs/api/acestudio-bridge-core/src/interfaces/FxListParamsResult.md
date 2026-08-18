# Interface: FxListParamsResult

Success payload of `fx list-params`.

## Properties

### filter?

```ts
optional filter?: string;
```

The `filter` pattern this answer was narrowed by. Absent when the answer is the plugin's whole parameter list.

***

### insertId

```ts
insertId: string;
```

Instance id of the insert that was read.

***

### name?

```ts
optional name?: string;
```

The name shown for that insert.

***

### names?

```ts
optional names?: string[];
```

The parameters' display names, in the plugin's own order. Present when `detail` was not asked for. Names are the plugin's and are not guaranteed unique — `detail` is what distinguishes two knobs a plugin calls the same thing.

***

### paramCount

```ts
paramCount: number;
```

Number of parameters answered with — after `filter`, if one was given.

***

### params?

```ts
optional params?: {
  automatable: boolean;
  choices?: string[];
  group?: string;
  index: number;
  kind: "boolean" | "continuous" | "stepped" | "choice";
  max?: number;
  min?: number;
  name: string;
  paramId: string;
  stepCount?: number;
  unit?: string;
}[];
```

One entry per parameter carrying its shape, in the plugin's own order. Present when `detail` was asked for.

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

#### group?

```ts
optional group?: string;
```

The plugin's own grouping for this parameter, when it declares one.

#### index

```ts
index: number;
```

The plugin's own parameter index. Informational — writes address the id, which survives a plugin update.

#### kind

```ts
kind: "boolean" | "continuous" | "stepped" | "choice";
```

What shape a parameter's range has, and so what a value means.

#### max?

```ts
optional max?: number;
```

High end of the range in the plugin's own units — the end a normalized 1 maps to. The mapping between the two is the plugin's and is often not linear, so read a value's `valueText` for what it renders as rather than interpolating between these.

#### min?

```ts
optional min?: number;
```

Low end of the range in the plugin's own units, as `unit` labels them — the end a normalized 0 maps to. Absent on a boolean and on a choice, which names its values instead.

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

***

### totalParamCount

```ts
totalParamCount: number;
```

How many parameters the plugin exposes in total. Equal to `paramCount` when nothing was filtered out; larger when a `filter` narrowed the answer.

***

### typeId?

```ts
optional typeId?: string;
```

Which effect it is.
