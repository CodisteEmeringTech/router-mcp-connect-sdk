import type {
  ConnectOptions,
  ConnectSuccessData,
  ConnectDisconnectData,
  ConnectErrorData,
  ConnectCloseData,
  ConnectEventData,
} from './types';
import { MESSAGE_TYPES, PROTOCOL_VERSION, EVENTS } from './constants';
import { validateOrigin } from './utils';

/**
 * Create a postMessage handler that routes iframe messages to SDK callbacks.
 * Validates origin on every message to prevent spoofing.
 */
export function createMessageHandler(
  iframe: HTMLIFrameElement,
  options: ConnectOptions,
  cleanupFn: () => void,
): (event: MessageEvent) => void {
  return (event: MessageEvent) => {
    // Security: validate origin against the actual iframe src
    if (!validateOrigin(event.origin, iframe.src)) return;
    // Security: validate source is our iframe
    if (event.source !== iframe.contentWindow) return;

    const { type, payload } = event.data ?? {};
    if (!type) return;

    switch (type) {
      case MESSAGE_TYPES.READY:
        // Hosted app loaded and token validated — forward as analytics event
        // (useConnect hook listens for this to set ready: true)
        options.onEvent?.({
          event: EVENTS.READY,
          timestamp: new Date().toISOString(),
        });
        break;

      case MESSAGE_TYPES.SUCCESS:
        options.onSuccess?.(payload as ConnectSuccessData);
        options.onEvent?.({
          event: EVENTS.CONNECTION_SUCCEEDED,
          timestamp: new Date().toISOString(),
          providerId: (payload as ConnectSuccessData).providerId,
        });
        break;

      case MESSAGE_TYPES.DISCONNECT:
        options.onDisconnect?.(payload as ConnectDisconnectData);
        options.onEvent?.({
          event: EVENTS.CONNECTION_DISCONNECTED,
          timestamp: new Date().toISOString(),
          providerId: (payload as ConnectDisconnectData).providerId,
        });
        break;

      case MESSAGE_TYPES.ERROR:
        options.onError?.(payload as ConnectErrorData);
        options.onEvent?.({
          event: EVENTS.CONNECTION_FAILED,
          timestamp: new Date().toISOString(),
          metadata: { code: (payload as ConnectErrorData).code },
        });
        break;

      case MESSAGE_TYPES.CLOSE:
        options.onClose?.(payload as ConnectCloseData);
        options.onEvent?.({
          event: EVENTS.CLOSED,
          timestamp: new Date().toISOString(),
          metadata: { reason: (payload as ConnectCloseData).reason },
        });
        cleanupFn();
        break;

      case MESSAGE_TYPES.RESIZE: {
        const container = iframe.parentElement;
        const height = (payload as { height: number }).height;
        if (container && height) {
          container.style.height = `${Math.min(height, 680)}px`;
        }
        break;
      }

      case MESSAGE_TYPES.EVENT:
        options.onEvent?.(payload as ConnectEventData);
        break;
    }
  };
}

/**
 * Send a typed message from the SDK parent to the hosted app iframe.
 */
export function sendMessage(
  iframe: HTMLIFrameElement,
  type: string,
  payload: Record<string, unknown> = {},
): void {
  iframe.contentWindow?.postMessage(
    { type, payload, version: PROTOCOL_VERSION },
    new URL(iframe.src).origin,
  );
}
