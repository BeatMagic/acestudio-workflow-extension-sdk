# Interface: JsonRpcMessage

A JSON-RPC 2.0 message as it arrives, before it is classified: a request
has `method` and `id`, a notification `method` alone, a response `id` with
`result` or `error`.

## Properties

### error?

```ts
optional error?: JsonRpcFault;
```

***

### id?

```ts
optional id?: number;
```

***

### jsonrpc?

```ts
optional jsonrpc?: string;
```

***

### method?

```ts
optional method?: string;
```

***

### params?

```ts
optional params?: unknown;
```

***

### result?

```ts
optional result?: unknown;
```
