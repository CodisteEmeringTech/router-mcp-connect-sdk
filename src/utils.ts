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
 * Build the full URL for the hosted Connect app.
 * The token is NOT passed via URL — it's sent via postMessage after iframe loads.
 */
export function buildHostedAppUrl(): string {
  return HOSTED_APP_URL;
}
