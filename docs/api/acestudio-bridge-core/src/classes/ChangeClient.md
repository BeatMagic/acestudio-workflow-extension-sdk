# Class: ChangeClient

## Constructors

### Constructor

```ts
new ChangeClient(peer): ChangeClient;
```

#### Parameters

##### peer

[`ChangePeer`](../interfaces/ChangePeer.md)

#### Returns

`ChangeClient`

## Methods

### onStateChanged()

```ts
onStateChanged(callback): Unsubscribe;
```

Host-emitted: a subject the peer may read has moved to a new revision.

Gated by its payload, not by this notification — see `\@payloadGated` in the
header note. Emitted per recipient: a peer whose grant does not reach the
channel is sent nothing at all, and gets no denial either, because it never
asked (an unsolicited error would itself confirm the change).

#### Parameters

##### callback

(`event`) => `void`

#### Returns

[`Unsubscribe`](../type-aliases/Unsubscribe.md)
