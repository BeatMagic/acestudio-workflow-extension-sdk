# Interface: PhonemeResetOverrideParams

Arguments for `phoneme reset-override`.

## Properties

### noteUuids

```ts
noteUuids: string[];
```

Notes to reset, by UUID, with braces. All must live in one clip. A tenuto note contributes its group's head note instead of itself, and a group named whole contributes that head once, so a caller may pass a raw selection.
