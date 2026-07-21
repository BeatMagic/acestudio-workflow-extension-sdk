/**
 * The submission API client (ADR 0089 §1, ADR 0098 §2). A pure transport: it
 * uploads the unsigned bundle with one bearer credential and hands back the
 * signed bytes and their metadata, or the service's own `{ error, code }` so
 * the caller can map the code to a stable exit status. It resolves nothing
 * about *which kind* of credential the bearer is — the service does that.
 */

export interface SignedResult {
  signedBundle: Uint8Array;
  extensionId: string;
  developerId: string;
  version: string;
  signedAt: number;
  bundleSha256: string;
  /** Filename the service suggests via content-disposition, if any. */
  filename: string | null;
}

export interface AdhocIdentity {
  developerId: string;
  secret: string;
}

/** A structured failure: the service's `code` when it answered, else transport. */
export interface ServiceError {
  status: number;
  code: string;
  message: string;
}

export type SubmitResult = { ok: true; value: SignedResult } | { ok: false; error: ServiceError };
export type MintResult = { ok: true; value: AdhocIdentity } | { ok: false; error: ServiceError };

const NETWORK_ERROR_CODE = "network-error";

function endpoint(service: URL, path: string): string {
  return new URL(path, service).toString();
}

async function errorFromResponse(response: Response): Promise<ServiceError> {
  try {
    const body = (await response.json()) as { error?: unknown; code?: unknown };
    if (typeof body.code === "string") {
      return {
        status: response.status,
        code: body.code,
        message: typeof body.error === "string" ? body.error : response.statusText,
      };
    }
  } catch {
    // Non-JSON body — fall through to a generic HTTP error.
  }
  return { status: response.status, code: "http-error", message: `HTTP ${response.status} ${response.statusText}` };
}

function filenameFromDisposition(header: string | null): string | null {
  if (header === null) return null;
  const match = /filename="([^"]+)"/.exec(header);
  return match?.[1] ?? null;
}

export async function submitBundle(
  service: URL,
  bearer: string,
  bundle: Uint8Array<ArrayBuffer>,
): Promise<SubmitResult> {
  let response: Response;
  try {
    response = await fetch(endpoint(service, "submissions"), {
      method: "POST",
      headers: { authorization: `Bearer ${bearer}`, "content-type": "application/zip" },
      // Wrapped in a Blob so the body is an unambiguous BodyInit; the explicit
      // content-type above still wins over the Blob's default.
      body: new Blob([bundle]),
    });
  } catch (error) {
    return { ok: false, error: { status: 0, code: NETWORK_ERROR_CODE, message: describeNetworkError(error, service) } };
  }
  if (!response.ok) {
    return { ok: false, error: await errorFromResponse(response) };
  }
  const signedAt = Number(response.headers.get("x-signed-at") ?? "");
  return {
    ok: true,
    value: {
      signedBundle: new Uint8Array(await response.arrayBuffer()),
      extensionId: response.headers.get("x-extension-id") ?? "",
      developerId: response.headers.get("x-developer-id") ?? "",
      version: response.headers.get("x-version") ?? "",
      signedAt: Number.isFinite(signedAt) ? signedAt : 0,
      bundleSha256: response.headers.get("x-bundle-sha256") ?? "",
      filename: filenameFromDisposition(response.headers.get("content-disposition")),
    },
  };
}

export async function mintAdhocIdentity(service: URL): Promise<MintResult> {
  let response: Response;
  try {
    response = await fetch(endpoint(service, "ad-hoc/identities"), { method: "POST" });
  } catch (error) {
    return { ok: false, error: { status: 0, code: NETWORK_ERROR_CODE, message: describeNetworkError(error, service) } };
  }
  if (!response.ok) {
    return { ok: false, error: await errorFromResponse(response) };
  }
  const body = (await response.json()) as { developerId?: unknown; secret?: unknown };
  if (typeof body.developerId !== "string" || typeof body.secret !== "string") {
    return {
      ok: false,
      error: { status: response.status, code: "malformed-response", message: "ad-hoc mint returned an unexpected body" },
    };
  }
  return { ok: true, value: { developerId: body.developerId, secret: body.secret } };
}

function describeNetworkError(error: unknown, service: URL): string {
  const detail = error instanceof Error ? error.message : String(error);
  return `could not reach the signing service at ${service.origin}: ${detail}`;
}
