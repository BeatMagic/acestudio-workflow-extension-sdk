import type { ZipLimits } from "./zip";

/**
 * The same archive bounds the signing service enforces on the way in
 * (pipeline.ts ZIP_LIMITS). Packing within them means a bundle rejected here
 * would have been rejected there too — the CLI just says so without a round
 * trip.
 */
export const ZIP_LIMITS: ZipLimits = {
  maxEntries: 10_000,
  maxTotalUncompressedBytes: 96 * 1024 * 1024,
};

/**
 * `pack` stamps every entry with a fixed modified-at so the same input tree
 * always produces the same bytes. The value is below the zip format's 1980
 * floor and clamps to it — the timestamp carries no information, the signed
 * content does.
 */
export const PACK_MODIFIED_AT = 0;

export const BUNDLE_EXTENSION = ".aceworkflow";
