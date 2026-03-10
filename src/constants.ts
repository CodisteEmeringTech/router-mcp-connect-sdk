/**
 * URL of the hosted Connect app (iframe target).
 * Replaced at build time via tsup `define` option.
 * Defaults to production URL — dev overrides to localhost:3100.
 */
declare const __CONNECT_APP_URL__: string;
export const HOSTED_APP_URL = __CONNECT_APP_URL__;

/** postMessage type constants */
export const MESSAGE_TYPES = {
  // Parent → Iframe
  INIT: 'connect:init',
  CLOSE_REQUEST: 'connect:close-request',
  // Iframe → Parent
  READY: 'connect:ready',
  RESIZE: 'connect:resize',
  SUCCESS: 'connect:success',
  DISCONNECT: 'connect:disconnect',
  ERROR: 'connect:error',
  CLOSE: 'connect:close',
  EVENT: 'connect:event',
} as const;

/** Protocol version for postMessage format */
export const PROTOCOL_VERSION = '1.0' as const;

/** Error codes */
export const ERROR_CODES = {
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_INVALID: 'TOKEN_INVALID',
  CREDENTIALS_INVALID: 'CREDENTIALS_INVALID',
  OAUTH_DENIED: 'OAUTH_DENIED',
  OAUTH_ERROR: 'OAUTH_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',
  PROVIDER_ERROR: 'PROVIDER_ERROR',
  SESSION_TIMEOUT: 'SESSION_TIMEOUT',
} as const;

/** Analytics event names */
export const EVENTS = {
  OPENED: 'connect.opened',
  READY: 'connect.ready',
  PROVIDER_SELECTED: 'connect.provider_selected',
  CREDENTIALS_SUBMITTED: 'connect.credentials_submitted',
  OAUTH_STARTED: 'connect.oauth_started',
  OAUTH_COMPLETED: 'connect.oauth_completed',
  CONNECTION_SUCCEEDED: 'connect.connection_succeeded',
  CONNECTION_FAILED: 'connect.connection_failed',
  CONNECTION_DISCONNECTED: 'connect.connection_disconnected',
  CLOSED: 'connect.closed',
} as const;
