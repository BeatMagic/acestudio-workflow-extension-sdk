# Type Alias: CallArgs\<Params\>

```ts
type CallArgs<Params> = Params extends readonly [] ? [undefined, CallOptions] : [Params[0], CallOptions];
```

A call's arguments: the declared parameter, then the options. Spelled as a tuple so
`call("ping")` needs nothing, `call("render", { stem })` needs its parameter, and a
call the declaration gives no parameter passes `undefined` before its options.

The positions are fixed rather than overloaded — options never slide forward into
the parameter's slot. A declared parameter can be any object, including `{}` or one
whose only field is `signal`, and a caller deciding what a value *meant* from its
shape would drop exactly those.

Both positions are optional: `options` is never required, and a call whose
declaration takes no parameter takes no arguments at all. An editor shows this
directly; a rendered signature that spells the elements out cannot, since generated
docs drop the `?` these tuple elements carry.

## Type Parameters

### Params

`Params` *extends* readonly `unknown`[]
