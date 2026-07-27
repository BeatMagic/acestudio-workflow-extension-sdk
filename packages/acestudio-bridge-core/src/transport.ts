/**
 * The transport seam: the message port `connect()` speaks over.
 *
 * @remarks
 * A transport carries **complete messages**, not bytes — framing belongs to
 * the transport (a stream socket length-prefixes; `postMessage` is already
 * delimited), so everything above it works in whole JSON-RPC bodies. Core
 * ships {@link LocalSocketTransport}; a browser-side consumer brings its own.
 */

/** Cancels a registration, and is safe to call more than once. */
export type Unsubscribe = () => void;

/**
 * A bidirectional message port. Each side owns one, so the message and close
 * handlers are single-slot: setting one replaces whatever was there.
 *
 * @public
 */
export interface Transport {
  /** Send one complete message. */
  send(message: string): void;
  /** Install the handler invoked with each complete inbound message. */
  onMessage(handler: (message: string) => void): void;
  /** Install the handler invoked once when the transport closes. */
  onClose(handler: () => void): void;
  /** Close the transport. Both ends observe the close. */
  close(): void;
}

/** The two ends of an in-memory transport pair. */
export interface TransportPair {
  /** The end a `connect()` call drives. */
  client: Transport;
  /** The end the host peer drives. */
  host: Transport;
}

/**
 * Build a connected pair of in-memory transports — the seam a test drives the
 * whole stack over, with no socket and no Studio process.
 *
 * Delivery is asynchronous (a microtask), so neither end can observe a message
 * arriving inside its own `send()` — the same ordering a real socket gives.
 *
 * @public
 */
export function createTransportPair(): TransportPair {
  const client = new InMemoryTransport();
  const host = new InMemoryTransport();
  client.connectTo(host);
  host.connectTo(client);
  return { client, host };
}

/** One end of a {@link createTransportPair} pair. */
class InMemoryTransport implements Transport {
  private peer: InMemoryTransport | undefined;
  private messageHandler: ((message: string) => void) | undefined;
  private closeHandler: (() => void) | undefined;
  private closed = false;

  connectTo(peer: InMemoryTransport): void {
    this.peer = peer;
  }

  send(message: string): void {
    if (this.closed) {
      return;
    }
    const peer = this.peer;
    queueMicrotask(() => peer?.deliver(message));
  }

  onMessage(handler: (message: string) => void): void {
    this.messageHandler = handler;
  }

  onClose(handler: () => void): void {
    this.closeHandler = handler;
  }

  close(): void {
    if (this.closed) {
      return;
    }
    this.closed = true;
    queueMicrotask(() => {
      this.fireClose();
      this.peer?.fireClose();
    });
  }

  private deliver(message: string): void {
    if (!this.closed) {
      this.messageHandler?.(message);
    }
  }

  private fireClose(): void {
    this.closed = true;
    const handler = this.closeHandler;
    this.closeHandler = undefined;
    handler?.();
  }
}
