# Interface: ClipSetGainResult

Success payload of `clip set-gain`.

## Properties

### clipType

```ts
clipType: string;
```

Clip type: `audio` or `video`.

***

### clipUuid

```ts
clipUuid: string;
```

UUID of the clip, with braces.

***

### gain

```ts
gain: number;
```

The clip's gain after the write, in decibels.
