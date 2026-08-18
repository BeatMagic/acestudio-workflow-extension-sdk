# Type Alias: TokensOfProfile\<Profiles, P\>

```ts
type TokensOfProfile<Profiles, P> = Profiles[P][number];
```

The tokens a profile stands for, as a type.

Reads the profile table as a type, so it needs one emitted `as const`. A table
that carries its record type as an annotation instead answers every lookup with
the whole capability-token union rather than the tokens that profile stands for,
which would scope every facade to everything.

## Type Parameters

### Profiles

`Profiles` *extends* `Readonly`\<`Record`\<`string`, readonly `string`[]\>\>

### P

`P` *extends* keyof `Profiles`
