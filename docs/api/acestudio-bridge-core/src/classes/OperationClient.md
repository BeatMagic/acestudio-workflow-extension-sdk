# Class: OperationClient

## Constructors

### Constructor

```ts
new OperationClient(peer): OperationClient;
```

#### Parameters

##### peer

[`OperationPeer`](../interfaces/OperationPeer.md)

#### Returns

`OperationClient`

## Methods

### operationInvoke()

```ts
operationInvoke(params): Promise<InvokeResult>;
```

Host-served: run one canonical operation and answer with its payload.

Gated by its payload, not by this method — see `@payloadGated` in the header
note. The fixed check pipeline the handler runs (ADR 0093 §5) is: session
valid, capability granted, busy gate for a mutating operation, content
fingerprint precondition, then actor attribution and the handler.

#### Parameters

##### params

[`InvokeParams`](../interfaces/InvokeParams.md)

#### Returns

`Promise`\<[`InvokeResult`](../interfaces/InvokeResult.md)\>
