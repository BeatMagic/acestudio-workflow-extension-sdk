# Interface: VoiceCommunityListResult

Success payload of `voice community-list`.

## Properties

### count?

```ts
optional count?: number;
```

Number of voices returned. Absent on fetch timeout.

***

### error?

```ts
optional error?: string;
```

Set to 'Timeout' when the catalog fetch timed out; retry the command. Absent on normal success.

***

### page

```ts
page: number;
```

The requested page number, echoed back (0-based).

***

### voices

```ts
voices: {
  group: string;
  id: number;
  isCollected?: boolean;
  name: string;
  nativeLanguage: string;
  routerId: number;
  routerName: string;
  supportedLanguages: string[];
  tags: string[];
}[];
```

Community voices on this page (up to 30). Empty on fetch timeout.

#### group

```ts
group: string;
```

Group identifier: empty for official, '#' for custom, other values for community.

#### id

```ts
id: number;
```

Numeric voice ID.

#### isCollected?

```ts
optional isCollected?: boolean;
```

Whether the voice is in your collection. Community voices only.

#### name

```ts
name: string;
```

Display name.

#### nativeLanguage

```ts
nativeLanguage: string;
```

Full English name of the voice's native language.

#### routerId

```ts
routerId: number;
```

ID of the default router.

#### routerName

```ts
routerName: string;
```

Name of the default router.

#### supportedLanguages

```ts
supportedLanguages: string[];
```

Full English names of languages the default router can sing.

#### tags

```ts
tags: string[];
```

Tag names attached to the voice.
