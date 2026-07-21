/**
 * Strict zip codec for `.aceworkflow` bundles. Deliberately a subset of the
 * zip spec: central-directory-driven, store/deflate only, no zip64, no
 * encryption, no multi-disk, duplicate paths rejected, every entry's declared
 * size and CRC-32 verified against its actual content. A submission gate
 * should reject anything unusual rather than guess — the packing side (this
 * CLI and first-party pipelines) controls what it produces.
 *
 * Byte-for-byte the same codec the signing service runs on the way in, so a
 * bundle this CLI packs is exactly what the service will accept, and a bundle
 * the service signs is exactly what this CLI reads back to self-verify.
 */

export class ZipError extends Error {}

export interface ZipFile {
  path: string;
  bytes: Uint8Array;
}

export interface ZipLimits {
  maxEntries: number;
  maxTotalUncompressedBytes: number;
}

const LOCAL_SIG = 0x04034b50;
const CENTRAL_SIG = 0x02014b50;
const EOCD_SIG = 0x06054b50;
const EOCD_SIZE = 22;
const LOCAL_HEADER_SIZE = 30;
const CENTRAL_HEADER_SIZE = 46;
const MAX_COMMENT = 0xffff;
const ZIP64_EXTRA_ID = 0x0001;
const METHOD_STORE = 0;
const METHOD_DEFLATE = 8;

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();

function crc32(bytes: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i += 1) c = CRC_TABLE[(c ^ bytes[i]!) & 0xff]! ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

// ignoreBOM keeps entry names byte-faithful — no silent BOM stripping.
const strictUtf8 = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true });

async function inflateRaw(compressed: Uint8Array, declaredLength: number): Promise<Uint8Array> {
  const body = new Response(compressed.slice()).body;
  if (body === null) throw new ZipError("entry data is unreadable");
  const reader = body.pipeThrough(new DecompressionStream("deflate-raw")).getReader();
  const out = new Uint8Array(declaredLength);
  let length = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      if (length + value.length > declaredLength) {
        throw new ZipError("entry inflates past its declared size");
      }
      out.set(value, length);
      length += value.length;
    }
  } catch (error) {
    if (error instanceof ZipError) throw error;
    throw new ZipError("entry data is not valid deflate");
  } finally {
    await reader.cancel().catch(() => undefined);
  }
  if (length !== declaredLength) throw new ZipError("entry inflates short of its declared size");
  return out;
}

async function deflateRaw(bytes: Uint8Array): Promise<Uint8Array> {
  const body = new Response(bytes.slice()).body;
  if (body === null) throw new ZipError("entry data is unreadable");
  const compressed = body.pipeThrough(new CompressionStream("deflate-raw"));
  return new Uint8Array(await new Response(compressed).arrayBuffer());
}

interface CentralEntry {
  path: string;
  isDirectory: boolean;
  method: number;
  crc: number;
  compressedSize: number;
  uncompressedSize: number;
  localOffset: number;
}

function findEndOfCentralDirectory(bytes: Uint8Array, view: DataView): number {
  const lowest = Math.max(0, bytes.length - EOCD_SIZE - MAX_COMMENT);
  for (let offset = bytes.length - EOCD_SIZE; offset >= lowest; offset -= 1) {
    if (
      view.getUint32(offset, true) === EOCD_SIG &&
      offset + EOCD_SIZE + view.getUint16(offset + 20, true) === bytes.length
    ) {
      return offset;
    }
  }
  throw new ZipError("no end-of-central-directory record found");
}

/**
 * Rejecting the zip64 extra field keeps declared sizes unambiguous. The walk
 * is strict: a subrecord overrunning the declared field length, or trailing
 * bytes too short to be a subrecord header, are malformed — not skipped.
 */
function rejectZip64Extra(view: DataView, start: number, length: number): void {
  let cursor = start;
  const end = start + length;
  while (cursor < end) {
    if (cursor + 4 > end) throw new ZipError("malformed extra field");
    const id = view.getUint16(cursor, true);
    const size = view.getUint16(cursor + 2, true);
    if (id === ZIP64_EXTRA_ID) throw new ZipError("zip64 archives are not supported");
    cursor += 4 + size;
    if (cursor > end) throw new ZipError("malformed extra field");
  }
}

export async function readZip(bytes: Uint8Array, limits: ZipLimits): Promise<ZipFile[]> {
  if (bytes.length < EOCD_SIZE) throw new ZipError("archive is too small to be a zip");
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

  const eocdOffset = findEndOfCentralDirectory(bytes, view);
  const diskNumber = view.getUint16(eocdOffset + 4, true);
  const centralDisk = view.getUint16(eocdOffset + 6, true);
  const entriesOnDisk = view.getUint16(eocdOffset + 8, true);
  const entriesTotal = view.getUint16(eocdOffset + 10, true);
  const centralSize = view.getUint32(eocdOffset + 12, true);
  const centralOffset = view.getUint32(eocdOffset + 16, true);

  if (diskNumber !== 0 || centralDisk !== 0 || entriesOnDisk !== entriesTotal) {
    throw new ZipError("multi-disk archives are not supported");
  }
  if (entriesTotal === 0xffff || centralSize === 0xffffffff || centralOffset === 0xffffffff) {
    throw new ZipError("zip64 archives are not supported");
  }
  if (entriesTotal > limits.maxEntries) {
    throw new ZipError(`archive exceeds the ${limits.maxEntries}-entry limit`);
  }
  if (centralOffset + centralSize > eocdOffset) {
    throw new ZipError("central directory is out of bounds");
  }

  const entries: CentralEntry[] = [];
  const seenPaths = new Set<string>();
  let totalUncompressed = 0;
  let cursor = centralOffset;
  for (let i = 0; i < entriesTotal; i += 1) {
    if (cursor + CENTRAL_HEADER_SIZE > eocdOffset || view.getUint32(cursor, true) !== CENTRAL_SIG) {
      throw new ZipError("malformed central directory");
    }
    const flags = view.getUint16(cursor + 8, true);
    const method = view.getUint16(cursor + 10, true);
    const crc = view.getUint32(cursor + 16, true);
    const compressedSize = view.getUint32(cursor + 20, true);
    const uncompressedSize = view.getUint32(cursor + 24, true);
    const nameLength = view.getUint16(cursor + 28, true);
    const extraLength = view.getUint16(cursor + 30, true);
    const commentLength = view.getUint16(cursor + 32, true);
    const diskStart = view.getUint16(cursor + 34, true);
    const localOffset = view.getUint32(cursor + 42, true);

    if ((flags & 0x0001) !== 0) throw new ZipError("encrypted entries are not supported");
    if (method !== METHOD_STORE && method !== METHOD_DEFLATE) {
      throw new ZipError(`unsupported compression method ${method}`);
    }
    if (compressedSize === 0xffffffff || uncompressedSize === 0xffffffff || localOffset === 0xffffffff) {
      throw new ZipError("zip64 archives are not supported");
    }
    if (diskStart !== 0) throw new ZipError("multi-disk archives are not supported");
    const nameEnd = cursor + CENTRAL_HEADER_SIZE + nameLength;
    if (nameEnd + extraLength + commentLength > eocdOffset) {
      throw new ZipError("malformed central directory");
    }
    rejectZip64Extra(view, nameEnd, extraLength);

    let path: string;
    try {
      path = strictUtf8.decode(bytes.subarray(cursor + CENTRAL_HEADER_SIZE, nameEnd));
    } catch {
      throw new ZipError("entry name is not valid UTF-8");
    }
    if (seenPaths.has(path)) throw new ZipError(`duplicate entry path: ${path}`);
    seenPaths.add(path);

    const isDirectory = path.endsWith("/");
    if (isDirectory && uncompressedSize !== 0) throw new ZipError("directory entry carries data");

    totalUncompressed += uncompressedSize;
    if (totalUncompressed > limits.maxTotalUncompressedBytes) {
      throw new ZipError("archive exceeds the total uncompressed size limit");
    }

    entries.push({ path, isDirectory, method, crc, compressedSize, uncompressedSize, localOffset });
    cursor = nameEnd + extraLength + commentLength;
  }
  if (cursor !== centralOffset + centralSize) throw new ZipError("central directory size mismatch");

  const files: ZipFile[] = [];
  for (const entry of entries) {
    if (entry.isDirectory) continue;
    if (entry.localOffset + LOCAL_HEADER_SIZE > centralOffset) {
      throw new ZipError("entry data is out of bounds");
    }
    if (view.getUint32(entry.localOffset, true) !== LOCAL_SIG) {
      throw new ZipError("local header mismatch");
    }
    // The central directory drives the read, but a local header that
    // disagrees with it is exactly the "unusual archive" this codec refuses:
    // a parser honoring local metadata would see a different entry.
    const localFlags = view.getUint16(entry.localOffset + 6, true);
    const localMethod = view.getUint16(entry.localOffset + 8, true);
    if ((localFlags & 0x0001) !== 0) throw new ZipError("encrypted entries are not supported");
    if (localMethod !== entry.method) {
      throw new ZipError("local header disagrees with the central directory");
    }
    const localNameLength = view.getUint16(entry.localOffset + 26, true);
    const localExtraLength = view.getUint16(entry.localOffset + 28, true);
    const nameStart = entry.localOffset + LOCAL_HEADER_SIZE;
    const dataStart = nameStart + localNameLength + localExtraLength;
    if (dataStart + entry.compressedSize > centralOffset) {
      throw new ZipError("entry data is out of bounds");
    }
    // The name must match too, or the archive is dual-view: a parser
    // honoring local names would see a different path than the one the
    // central-directory gates checked. Strict UTF-8 round-trips byte-exact,
    // so re-encoding the decoded central name compares the original bytes.
    const centralName = new TextEncoder().encode(entry.path);
    const localName = bytes.subarray(nameStart, nameStart + localNameLength);
    if (localNameLength !== centralName.length || !centralName.every((byte, i) => byte === localName[i])) {
      throw new ZipError("local header disagrees with the central directory");
    }
    rejectZip64Extra(view, nameStart + localNameLength, localExtraLength);
    const compressed = bytes.subarray(dataStart, dataStart + entry.compressedSize);

    let content: Uint8Array;
    if (entry.method === METHOD_STORE) {
      if (entry.compressedSize !== entry.uncompressedSize) {
        throw new ZipError("stored entry size mismatch");
      }
      content = compressed.slice();
    } else {
      content = await inflateRaw(compressed, entry.uncompressedSize);
    }
    if (crc32(content) !== entry.crc) {
      throw new ZipError(`entry checksum mismatch: ${entry.path}`);
    }
    files.push({ path: entry.path, bytes: content });
  }
  return files;
}

/** MS-DOS date/time pair from Unix seconds, clamped to the format's 1980 floor. */
function dosDateTime(unixSeconds: number): { date: number; time: number } {
  const at = new Date(Math.max(unixSeconds, 315532800) * 1000);
  const date =
    ((Math.min(at.getUTCFullYear(), 2107) - 1980) << 9) | ((at.getUTCMonth() + 1) << 5) | at.getUTCDate();
  const time = (at.getUTCHours() << 11) | (at.getUTCMinutes() << 5) | (at.getUTCSeconds() >> 1);
  return { date, time };
}

function isAscii(bytes: Uint8Array): boolean {
  return bytes.every((byte) => byte < 0x80);
}

/**
 * Writes entries in the given order, deflating each unless stored is smaller.
 * `modifiedAtSeconds` stamps every entry, so output depends only on the
 * inputs — for a reproducible `pack` that is a fixed epoch, and for the
 * signing pipeline the server-clock signedAt.
 */
export async function writeZip(files: readonly ZipFile[], modifiedAtSeconds: number): Promise<Uint8Array<ArrayBuffer>> {
  if (files.length >= 0xffff) throw new ZipError("too many entries for a zip archive");
  const { date, time } = dosDateTime(modifiedAtSeconds);
  const encoder = new TextEncoder();

  // Sequential on purpose: preparing one entry at a time keeps a single
  // compression stream's state live instead of one per entry.
  const prepared = [];
  for (const file of files) {
    const nameBytes = encoder.encode(file.path);
    if (nameBytes.length > 0xffff) throw new ZipError(`entry path is too long: ${file.path}`);
    const deflated = await deflateRaw(file.bytes);
    const useDeflate = deflated.length < file.bytes.length;
    prepared.push({
      nameBytes,
      flags: isAscii(nameBytes) ? 0 : 0x0800,
      method: useDeflate ? METHOD_DEFLATE : METHOD_STORE,
      crc: crc32(file.bytes),
      data: useDeflate ? deflated : file.bytes,
      uncompressedSize: file.bytes.length,
    });
  }

  const localTotal = prepared.reduce(
    (sum, entry) => sum + LOCAL_HEADER_SIZE + entry.nameBytes.length + entry.data.length,
    0,
  );
  const centralTotal = prepared.reduce((sum, entry) => sum + CENTRAL_HEADER_SIZE + entry.nameBytes.length, 0);
  const totalSize = localTotal + centralTotal + EOCD_SIZE;
  if (totalSize > 0xfffffffe) throw new ZipError("archive exceeds the zip format's size limit");

  const out = new Uint8Array(totalSize);
  const view = new DataView(out.buffer);
  const localOffsets: number[] = [];
  let cursor = 0;

  for (const entry of prepared) {
    localOffsets.push(cursor);
    view.setUint32(cursor, LOCAL_SIG, true);
    view.setUint16(cursor + 4, 20, true);
    view.setUint16(cursor + 6, entry.flags, true);
    view.setUint16(cursor + 8, entry.method, true);
    view.setUint16(cursor + 10, time, true);
    view.setUint16(cursor + 12, date, true);
    view.setUint32(cursor + 14, entry.crc, true);
    view.setUint32(cursor + 18, entry.data.length, true);
    view.setUint32(cursor + 22, entry.uncompressedSize, true);
    view.setUint16(cursor + 26, entry.nameBytes.length, true);
    view.setUint16(cursor + 28, 0, true);
    out.set(entry.nameBytes, cursor + LOCAL_HEADER_SIZE);
    out.set(entry.data, cursor + LOCAL_HEADER_SIZE + entry.nameBytes.length);
    cursor += LOCAL_HEADER_SIZE + entry.nameBytes.length + entry.data.length;
  }

  const centralStart = cursor;
  for (let i = 0; i < prepared.length; i += 1) {
    const entry = prepared[i]!;
    view.setUint32(cursor, CENTRAL_SIG, true);
    view.setUint16(cursor + 4, 20, true);
    view.setUint16(cursor + 6, 20, true);
    view.setUint16(cursor + 8, entry.flags, true);
    view.setUint16(cursor + 10, entry.method, true);
    view.setUint16(cursor + 12, time, true);
    view.setUint16(cursor + 14, date, true);
    view.setUint32(cursor + 16, entry.crc, true);
    view.setUint32(cursor + 20, entry.data.length, true);
    view.setUint32(cursor + 24, entry.uncompressedSize, true);
    view.setUint16(cursor + 28, entry.nameBytes.length, true);
    view.setUint32(cursor + 42, localOffsets[i]!, true);
    out.set(entry.nameBytes, cursor + CENTRAL_HEADER_SIZE);
    cursor += CENTRAL_HEADER_SIZE + entry.nameBytes.length;
  }

  view.setUint32(cursor, EOCD_SIG, true);
  view.setUint16(cursor + 8, prepared.length, true);
  view.setUint16(cursor + 10, prepared.length, true);
  view.setUint32(cursor + 12, cursor - centralStart, true);
  view.setUint32(cursor + 16, centralStart, true);
  return out;
}
