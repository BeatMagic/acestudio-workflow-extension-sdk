# Interface: TransportStateResult

Success payload of `transport state`.

## Properties

### position

```ts
position: number;
```

Current playback head position in seconds from the start of the project.

***

### status

```ts
status: string;
```

Transport state: `stopped`, `playing`, or `playing but interrupted` (play intention active but audio paused pending synthesis).
