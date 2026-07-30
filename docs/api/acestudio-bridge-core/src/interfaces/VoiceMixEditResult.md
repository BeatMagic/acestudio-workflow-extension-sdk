# Interface: VoiceMixEditResult

Success payload of `voice mix-edit`.

## Properties

### group

```ts
group: string;
```

Group identifier of the blended-voice library the voice belongs to.

***

### head

```ts
head: number;
```

Avatar id, or -1 when the voice falls back to its first seed's avatar.

***

### id

```ts
id: number;
```

The blended voice's library id. Pass it to `voice mix-edit --id`, or to `voice load --id` with group '#'.

***

### language

```ts
language: string;
```

Full English name of the voice's language.

***

### name

```ts
name: string;
```

Display name.

***

### routerId

```ts
routerId: number;
```

Id of the synthesis router the blend sings through.

***

### routerName

```ts
routerName: string;
```

Name of that router.

***

### seeds

```ts
seeds: {
  code: number;
  lock: boolean;
  name?: string;
  style: number;
  timbre: number;
}[];
```

The recipe, one entry per seed voice.

#### code

```ts
code: number;
```

The seed voice's code.

#### lock

```ts
lock: boolean;
```

Whether the seed's weights are locked against redistribution when other weights change.

#### name?

```ts
optional name?: string;
```

The seed voice's name. Omitted when the seed is no longer in the local registry.

#### style

```ts
style: number;
```

The seed's style weight in the blend.

#### timbre

```ts
timbre: number;
```

The seed's timbre weight in the blend.

***

### tags

```ts
tags: string[];
```

Tag names attached to the voice.
