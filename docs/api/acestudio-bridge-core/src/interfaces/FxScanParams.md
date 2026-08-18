# Interface: FxScanParams

Arguments for `fx scan`.

## Properties

### full?

```ts
optional full?: boolean;
```

Start over: wipe the blocklist and the scan cache, then re-scan every plugin on disk. Slower, and it gives a previously blocklisted plugin another chance to load.
