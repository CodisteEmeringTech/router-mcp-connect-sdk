// ─── Public Types ───────────────────────────────────────────────

/** Options passed to RouteMCPConnect.open() */
export interface ConnectOptions {
  /** Session token from POST /api/v1/connect/token or /connect/sessions */
  token: string;
  /** Called when a connection is successfully created */
  onSuccess?: (data: ConnectSuccessData) => void;
  /** Called when an unrecoverable error occurs */
  onError?: (error: ConnectErrorData) => void;
  /** Called when the modal is closed (by user, after success, or after error) */
  onClose?: (data: ConnectCloseData) => void;
  /** Called when the end user disconnects a provider */
  onDisconnect?: (data: ConnectDisconnectData) => void;
  /** Called for every lifecycle event (analytics) */
  onEvent?: (event: ConnectEventData) => void;
  /** Skip provider picker — go directly to this provider */
  providerId?: string;
  /** Open in reconnect mode (show re-auth message) */
  reconnect?: boolean;
  /** Allow connecting multiple providers in one session */
  allowMultiple?: boolean;
}

/** Data returned on successful connection */
export interface ConnectSuccessData {
  connectionId: string;
  providerId: string;
  providerSlug: string;
}

/** Data returned when a provider is disconnected */
export interface ConnectDisconnectData {
  providerId: string;
  providerSlug: string;
}

/** Data returned on error */
export interface ConnectErrorData {
  code: string;
  message: string;
}

/** Data returned on modal close */
export interface ConnectCloseData {
  reason: 'user' | 'success' | 'error';
}

/** Analytics event data */
export interface ConnectEventData {
  event: string;
  timestamp: string;
  providerId?: string;
  metadata?: Record<string, unknown>;
}

/** Handle returned by RouteMCPConnect.open() */
export interface ConnectInstance {
  /** Programmatically close the Connect modal */
  close: () => void;
}

// ─── PostMessage Protocol ───────────────────────────────────────

/** Base message structure for all postMessage communication */
export interface ConnectMessage<T = unknown> {
  type: string;
  payload: T;
  version: '1.0';
}

/** Messages sent from SDK parent → hosted app (iframe) */
export type ParentMessage =
  | ConnectMessage<ConnectInitPayload> & { type: 'connect:init' }
  | ConnectMessage<Record<string, never>> & { type: 'connect:close-request' };

export interface ConnectInitPayload {
  token: string;
  providerId?: string;
  reconnect?: boolean;
  allowMultiple?: boolean;
}

/** Messages sent from hosted app (iframe) → SDK parent */
export type IframeMessage =
  | ConnectMessage<Record<string, never>> & { type: 'connect:ready' }
  | ConnectMessage<{ height: number }> & { type: 'connect:resize' }
  | ConnectMessage<ConnectSuccessData> & { type: 'connect:success' }
  | ConnectMessage<ConnectDisconnectData> & { type: 'connect:disconnect' }
  | ConnectMessage<ConnectErrorData> & { type: 'connect:error' }
  | ConnectMessage<ConnectCloseData> & { type: 'connect:close' }
  | ConnectMessage<ConnectEventData> & { type: 'connect:event' };
