# Interface: ClipSetEnabledResult

Success payload of `clip set-enabled`.

## Properties

### clips

```ts
clips: {
  clipUuid: string;
  enabled: boolean;
}[];
```

One row per updated clip, in the order given.

#### clipUuid

```ts
clipUuid: string;
```

UUID of the clip, with braces.

#### enabled

```ts
enabled: boolean;
```

Whether the clip is now enabled.

***

### updatedCount

```ts
updatedCount: number;
```

How many clips were addressed.
