import { HOSTED_APP_URL } from './constants';

/**
 * Validate that a postMessage origin matches the hosted app URL.
 * Uses the actual iframe src origin at runtime (derived from HOSTED_APP_URL).
 * Prevents processing messages from untrusted sources.
 */
export function validateOrigin(origin: string, iframeSrc?: string): boolean {
  const trustedOrigin = new URL(iframeSrc || HOSTED_APP_URL).origin;
  return origin === trustedOrigin;
}

/**
 * Connect app API client uses paths like `/api/v1/sdk-config` against an origin-only base.
 * Any path in the input (e.g. `/api/v1`) is dropped — only `origin` is kept.
 */
export function normalizeConnectApiBaseUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return '';

  try {
    return new URL(trimmed).origin;
  } catch {
    return trimmed.replace(/\/+$/, '');
  }
}

/**
 * Resolve the hosted connect app URL for the iframe.
 * Uses `override` when provided; otherwise the SDK build-time `HOSTED_APP_URL`.
 * Token is not passed in the URL — it is sent via postMessage after load.
 */
export function resolveConnectAppUrl(override?: string): string {
  const trimmed = override?.trim();
  if (!trimmed) {
    return HOSTED_APP_URL;
  }
  try {
    const parsed = new URL(trimmed);
    const path = parsed.pathname.replace(/\/+$/, '');
    return path ? `${parsed.origin}${path}` : parsed.origin;
  } catch {
    return trimmed.replace(/\/+$/, '');
  }
}

/** @deprecated Use resolveConnectAppUrl */
export function buildHostedAppUrl(override?: string): string {
  return resolveConnectAppUrl(override);
}
