# Interface: GenerativeVoiceChangerModelsResult

Success payload of `generative voice-changer models`.

## Properties

### count

```ts
count: number;
```

***

### models

```ts
models: {
  avatarUrl?: string;
  id: number;
  kind: "instrument" | "voice" | "cloned";
  name: string;
  seedId?: number;
  tags: string[];
  trialAudioUrl?: string;
  version?: string;
}[];
```

Every model matching the filter, across every requested kind. Never truncated. Empty while the roster is `warming`.

#### avatarUrl?

```ts
optional avatarUrl?: string;
```

Where the model's avatar image lives. A caller that wants the picture downloads it itself.

#### id

```ts
id: number;
```

Numeric model id. A legal `modelIds` entry for `generative voice-changer convert`.

#### kind

```ts
kind: "instrument" | "voice" | "cloned";
```

Which of the Voice Changer's three model pages a model came from — the panel's own tabs, which is how a user thinks about the roster. `convert` accepts an id from any of the three; the kind narrows a listing and reports what a row turned out to be, and is never a precondition.

#### name

```ts
name: string;
```

#### seedId?

```ts
optional seedId?: number;
```

The voice seed this model was trained from, when it has one.

#### tags

```ts
tags: string[];
```

Tag names attached to the model. The model's language is carried as one of these rather than as a field of its own, which is how the roster arrives and how the panel filters on it.

#### trialAudioUrl?

```ts
optional trialAudioUrl?: string;
```

Where the model's trial audio lives, when it has one.

#### version?

```ts
optional version?: string;
```

The model's version string, as the service published it.

***

### status

```ts
status: "warming" | "ready";
```

Whether a `generative voice-changer models` listing is the whole roster. The roster is fetched once when the account signs in, so a listing in a settled session is `ready`. A fetch still in flight — or one the network lost — leaves it empty, and an empty list is then "ask again", not "you own no models". Saying which is what keeps a caller from drawing the wrong conclusion from zero rows.
