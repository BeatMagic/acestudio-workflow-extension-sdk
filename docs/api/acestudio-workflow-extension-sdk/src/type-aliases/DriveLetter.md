# Type Alias: DriveLetter

```ts
type DriveLetter = 
  | Lowercase<UppercaseDriveLetter>
  | UppercaseDriveLetter;
```

A single letter, either case — the only thing before the colon that the host
reads as a drive. Spelled out because a template literal type cannot say "one
letter" any other way, and `${string}:` would admit `Disk:/Stems`.
