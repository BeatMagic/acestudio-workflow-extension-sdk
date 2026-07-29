# Type Alias: DebugLog

```ts
type DebugLog = (message) => void;
```

Where a debug line goes. One per connection, handed down to whatever does the
work, so nothing below has to know whether debug mode is on.

## Parameters

### message

`string`

## Returns

`void`
