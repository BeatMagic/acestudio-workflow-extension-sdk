# Type Alias: TokensOfProfile\<Profiles, P\>

```ts
type TokensOfProfile<Profiles, P> = Profiles[P][number];
```

The tokens a profile stands for, as a type.

Reads the profile table as a type, so it needs one emitted `as const`: an
annotated `Readonly<Record<string, readonly Token[]>>` answers with the whole
token union for every profile, which would scope every facade to everything.

## Type Parameters

### Profiles

`Profiles` *extends* `Readonly`\<`Record`\<`string`, readonly `string`[]\>\>

### P

`P` *extends* keyof `Profiles`
