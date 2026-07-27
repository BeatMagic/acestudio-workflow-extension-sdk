# Interface: SessionPeer

## Methods

### notify()

```ts
notify(method, params?): void;
```

#### Parameters

##### method

`string`

##### params?

`unknown`

#### Returns

`void`

***

### request()

```ts
request<T>(method, params?): Promise<T>;
```

#### Type Parameters

##### T

`T`

#### Parameters

##### method

`string`

##### params?

`unknown`

#### Returns

`Promise`\<`T`\>

***

### setRequestHandler()

```ts
setRequestHandler<P, R>(method, handler): void;
```

#### Type Parameters

##### P

`P`

##### R

`R`

#### Parameters

##### method

`string`

##### handler

(`params`) => `R` \| `Promise`\<`R`\>

#### Returns

`void`

***

### subscribe()

```ts
subscribe<T>(method, callback): Unsubscribe;
```

#### Type Parameters

##### T

`T`

#### Parameters

##### method

`string`

##### callback

(`event`) => `void`

#### Returns

[`Unsubscribe`](../type-aliases/Unsubscribe.md)
