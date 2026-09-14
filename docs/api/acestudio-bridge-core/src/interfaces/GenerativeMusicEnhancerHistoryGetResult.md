# Interface: GenerativeMusicEnhancerHistoryGetResult

Success payload of `generative music-enhancer history get`.

## Properties

### generation?

```ts
optional generation?: {
  audios: {
     duration: number;
     localPath?: string;
     resultId: string;
     state: "streaming" | "need-download" | "downloading" | "local-ready";
  }[];
  generatingNum?: number;
  id: number;
  lyrics: string;
  status: "generating" | "succeeded" | "failed";
  tags: string;
  taskId: string;
  title: string;
};
```

One generation in the history: the row the panels show, with each finished audio carrying its result id and local state.

#### audios

```ts
audios: {
  duration: number;
  localPath?: string;
  resultId: string;
  state: "streaming" | "need-download" | "downloading" | "local-ready";
}[];
```

The finished audios.

#### generatingNum?

```ts
optional generatingNum?: number;
```

Audios still being produced; present only while `status` is `generating`. These have no result id yet — a generating slot is not addressable until its audio id exists.

#### id

```ts
id: number;
```

The generation row's server id.

#### lyrics

```ts
lyrics: string;
```

#### status

```ts
status: "generating" | "succeeded" | "failed";
```

How far one history generation has settled, as the server reports it.

#### tags

```ts
tags: string;
```

#### taskId

```ts
taskId: string;
```

The task id — the generation half of every result id here, and the key `history get` takes.

#### title

```ts
title: string;
```

***

### status

```ts
status: "warming" | "ready";
```

Whether the page a history read answers is the fetched one.
