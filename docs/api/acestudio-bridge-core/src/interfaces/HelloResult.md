# Interface: HelloResult

The handshake response. `grantedCapabilities` is the session's grant as flat
canonical token names; `surfaceVersion` is the `major.minor` contract
version [connect](../functions/connect.md) checks against the bindings'.

## Properties

### appVersion

```ts
appVersion: string;
```

***

### grantedCapabilities

```ts
grantedCapabilities: readonly string[];
```

***

### protocolVersion

```ts
protocolVersion: number;
```

***

### sessionId

```ts
sessionId: string;
```

***

### surfaceVersion?

```ts
optional surfaceVersion?: string;
```

Empty from a host predating the field — then the version check is skipped.
