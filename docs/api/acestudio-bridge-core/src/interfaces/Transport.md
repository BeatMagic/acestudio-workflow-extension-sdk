# Interface: Transport

A bidirectional message port. Each side owns one, so the message and close
handlers are single-slot: setting one replaces whatever was there.

## Methods

### close()

```ts
close(): void;
```

Close the transport. Both ends observe the close.

#### Returns

`void`

***

### onClose()

```ts
onClose(handler): void;
```

Install the handler invoked once when the transport closes.

#### Parameters

##### handler

() => `void`

#### Returns

`void`

***

### onMessage()

```ts
onMessage(handler): void;
```

Install the handler invoked with each complete inbound message.

#### Parameters

##### handler

(`message`) => `void`

#### Returns

`void`

***

### send()

```ts
send(message): void;
```

Send one complete message.

#### Parameters

##### message

`string`

#### Returns

`void`
