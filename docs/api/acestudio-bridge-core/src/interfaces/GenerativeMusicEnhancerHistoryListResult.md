# Interface: GenerativeMusicEnhancerHistoryListResult

Success payload of `generative music-enhancer history list`.

## Properties

### generations

```ts
generations: {
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
}[];
```

The requested page's generations, newest first. Empty while `status` is `warming`.

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

### page

```ts
page: number;
```

The page this answer names (echoed from the request).

***

### pageSize

```ts
pageSize: number;
```

The page size this answer names (echoed from the request).

***

### status

```ts
status: "warming" | "ready";
```

Whether the page a history read answers is the fetched one.

***

### total

```ts
total: number;
```

Every row the account holds, as the server reported. 0 while nothing has been fetched yet.
