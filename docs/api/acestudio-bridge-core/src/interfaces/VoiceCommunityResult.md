# Interface: VoiceCommunityResult

Success payload of `voice community`.

## Properties

### count?

```ts
optional count?: number;
```

How many voices this page returned.

***

### error?

```ts
optional error?: string;
```

Set to `Timeout` when the catalog fetch timed out; retry the command. Absent on normal success.

***

### page

```ts
page: number;
```

The requested page, echoed back. 0-based.

***

### pageSize?

```ts
optional pageSize?: number;
```

Voices per page; always 30.

***

### totalPages?

```ts
optional totalPages?: number;
```

How many pages match the current filters. Reported with the page itself so a caller never has to issue a second query, with the filters repeated exactly, to find out.

***

### voices

```ts
voices: {
  id: number;
  isCollected: boolean;
  modelId?: number;
  modelName?: string;
  name: string;
  nativeLanguage?: string;
  ref: string;
  supportedLanguages?: string[];
  tags: string[];
}[];
```

The voices on this page. Empty when the catalog fetch timed out.

#### id

```ts
id: number;
```

Numeric community voice id.

#### isCollected

```ts
isCollected: boolean;
```

Whether this voice is already in your library. An uncollected voice must be collected before it will load onto a track.

#### modelId?

```ts
optional modelId?: number;
```

Id of its default vocal synth model.

#### modelName?

```ts
optional modelName?: string;
```

Name of that model.

#### name

```ts
name: string;
```

Display name.

#### nativeLanguage?

```ts
optional nativeLanguage?: string;
```

Full English name of the voice's native language.

#### ref

```ts
ref: string;
```

Ref for this voice, in the form `singer:\@\<id\>`. Accepted by `voice collect --source` and, once collected, by `sound-source load --source`.

#### supportedLanguages?

```ts
optional supportedLanguages?: string[];
```

Full English names of the languages it can sing on its default model.

#### tags

```ts
tags: string[];
```

Tag names attached to the voice.
