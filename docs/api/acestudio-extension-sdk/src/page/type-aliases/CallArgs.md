# Type Alias: CallArgs\<Params\>

```ts
type CallArgs<Params> = Params extends readonly [] ? [CallOptions] : [Params[0], CallOptions];
```

A call's arguments: the declared parameter, if the call takes one, plus optional
per-call options. Spelled as a tuple so `call("ping")` needs no placeholder and
`call("render", { stem })` needs its parameter.

## Type Parameters

### Params

`Params` *extends* readonly `unknown`[]
