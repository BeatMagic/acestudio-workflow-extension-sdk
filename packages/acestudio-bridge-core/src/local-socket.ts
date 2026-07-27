/**
 * The local-socket transport: a Unix-domain socket or Windows named pipe,
 * with each message wrapped in a 4-byte big-endian length prefix — the framing
 * ACE Studio's bridge server speaks.
 */

import { createConnection, type Socket } from "node:net";
import { BridgeError } from "./errors.js";
import type { Transport } from "./transport.js";

/** Bytes of length prefix in front of each message. */
const HEADER_BYTES = 4;

/**
 * Largest message the framing accepts, in bytes. Results can embed base64
 * audio, so the cap is generous; anything past it is a framing bug, not a big
 * payload, and buffering toward it would be the actual damage.
 */
const MAX_FRAME_SIZE = 16 * 1024 * 1024;

/**
 * Wrap a message in its length prefix.
 *
 * @public
 */
export function encodeFrame(message: string): Buffer {
  const payload = Buffer.from(message, "utf8");
  const header = Buffer.allocUnsafe(HEADER_BYTES);
  header.writeUInt32BE(payload.length, 0);
  return Buffer.concat([header, payload]);
}

/**
 * Incremental reader for the length-prefixed framing: feed it socket chunks,
 * take back whichever complete messages that made available.
 *
 * @public
 */
export class FrameDecoder {
  private buffer: Buffer = Buffer.alloc(0);

  /**
   * Append a chunk and return the messages now complete, buffering any
   * partial tail.
   *
   * @throws Error when a declared frame exceeds the size cap.
   */
  push(chunk: Buffer): string[] {
    this.buffer = this.buffer.length === 0 ? chunk : Buffer.concat([this.buffer, chunk]);
    const messages: string[] = [];
    while (this.buffer.length >= HEADER_BYTES) {
      const length = this.buffer.readUInt32BE(0);
      if (length > MAX_FRAME_SIZE) {
        throw new Error(`frame size ${length} exceeds the ${MAX_FRAME_SIZE}-byte limit`);
      }
      if (this.buffer.length < HEADER_BYTES + length) {
        break;
      }
      messages.push(this.buffer.subarray(HEADER_BYTES, HEADER_BYTES + length).toString("utf8"));
      this.buffer = this.buffer.subarray(HEADER_BYTES + length);
    }
    return messages;
  }
}

/**
 * A {@link Transport} over a connected stream socket.
 *
 * @public
 */
export class LocalSocketTransport implements Transport {
  private readonly socket: Socket;
  private readonly decoder = new FrameDecoder();
  private messageHandler: ((message: string) => void) | undefined;
  private closeHandler: (() => void) | undefined;

  private constructor(socket: Socket) {
    this.socket = socket;
    socket.on("data", (chunk: Buffer) => {
      let messages: string[];
      try {
        messages = this.decoder.push(chunk);
      } catch {
        // A frame we cannot trust the boundaries of: the stream is
        // unrecoverable, so drop it and let the close drive teardown.
        socket.destroy();
        return;
      }
      for (const message of messages) {
        this.messageHandler?.(message);
      }
    });
    // Socket errors (the host crashing, say) arrive just before 'close', and
    // 'close' is what drives teardown. An unhandled 'error' would throw out of
    // the event loop instead and take the consumer down with it.
    socket.on("error", () => {});
    socket.on("close", () => {
      const handler = this.closeHandler;
      this.closeHandler = undefined;
      handler?.();
    });
  }

  /**
   * Dial the bridge server listening on `socketPath`.
   *
   * @throws BridgeError with code `BRIDGE_UNREACHABLE` when the socket cannot
   * be reached.
   */
  static connect(socketPath: string): Promise<LocalSocketTransport> {
    return new Promise<LocalSocketTransport>((resolve, reject) => {
      const socket = createConnection(socketPath);
      const onError = (cause: Error): void => {
        socket.removeListener("connect", onConnect);
        reject(
          new BridgeError({
            code: "BRIDGE_UNREACHABLE",
            message: `Cannot reach the ACE Studio bridge at '${socketPath}': ${cause.message}`,
            hint: "confirm ACE Studio is running and the socket path is the one it published",
            cause,
          }),
        );
      };
      const onConnect = (): void => {
        // Build the transport before dropping the connect-time guard: it
        // installs its own 'error' listener, so the socket is never without one.
        const transport = new LocalSocketTransport(socket);
        socket.removeListener("error", onError);
        resolve(transport);
      };
      socket.once("error", onError);
      socket.once("connect", onConnect);
    });
  }

  send(message: string): void {
    this.socket.write(encodeFrame(message));
  }

  onMessage(handler: (message: string) => void): void {
    this.messageHandler = handler;
  }

  onClose(handler: () => void): void {
    this.closeHandler = handler;
  }

  close(): void {
    this.socket.end();
  }
}
