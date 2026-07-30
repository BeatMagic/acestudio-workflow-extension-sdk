# Interface: VoiceMixDeleteResult

Success payload of `voice mix-delete`.

## Properties

### id

```ts
id: number;
```

Library id of the deleted blended voice.

***

### maximum

```ts
maximum: number;
```

The library's ceiling, so a caller can tell whether a `voice mix-create` will now fit.

***

### name

```ts
name: string;
```

Display name it had when it was deleted.

***

### remaining

```ts
remaining: number;
```

How many blended voices the library still holds.
