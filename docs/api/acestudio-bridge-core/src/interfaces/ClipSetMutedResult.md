# Interface: ClipSetMutedResult

Success payload of `clip set-muted`.

## Properties

### clips

```ts
clips: {
  clipUuid: string;
  muted: boolean;
}[];
```

One row per updated clip, in the order given.

#### clipUuid

```ts
clipUuid: string;
```

UUID of the clip, with braces.

#### muted

```ts
muted: boolean;
```

Whether the clip's embedded audio is now muted.

***

### updatedCount

```ts
updatedCount: number;
```

How many clips were addressed.
