# Interface: ServedAsset

A URL a page can read, for as long as it is not revoked.

## Properties

### url

```ts
readonly url: string;
```

The URL to hand the page — through a channel call's result, an event, anything.
Opaque: it says nothing about where the bytes came from, so a path on the user's
disk does not end up in a page's DOM.

## Methods

### revoke()

```ts
revoke(): void;
```

Stop serving it. The URL stops resolving immediately; a transfer already in
flight is left to finish, because cutting a video mid-buffer to reclaim a token
helps nobody. A stream nobody read is closed, since serving it was the last thing
holding it open.

Revoking twice is not an error. Every handle is revoked when the run ends.

#### Returns

`void`
