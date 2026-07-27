# Interface: JsonRpcFault

The error object a JSON-RPC peer answers with in place of a result. The host
puts the canonical error code on `data.code`.

## Properties

### code

```ts
code: number;
```

***

### data?

```ts
optional data?: unknown;
```

***

### message

```ts
message: string;
```
