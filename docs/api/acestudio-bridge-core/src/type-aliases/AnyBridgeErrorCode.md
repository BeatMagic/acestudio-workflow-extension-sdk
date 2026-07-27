# Type Alias: AnyBridgeErrorCode

```ts
type AnyBridgeErrorCode = 
  | BridgeErrorCode
  | SdkErrorCode;
```

Every code a [BridgeError](../classes/BridgeError.md) can carry: the generated canonical codes
plus the SDK-local ones.
