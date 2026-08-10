import type { ConnectOptions, ConnectInstance } from './types';
import { MESSAGE_TYPES, EVENTS } from './constants';
import { createIframe } from './iframe';
import { createOverlay } from './overlay';
import { createMessageHandler, sendMessage } from './messaging';
import { resolveConnectAppUrl, normalizeConnectApiBaseUrl } from './utils';

export type {
  ConnectOptions,
  ConnectSuccessData,
  ConnectDisconnectData,
  ConnectErrorData,
  ConnectCloseData,
  ConnectEventData,
  ConnectInstance,
  ConnectMessage,
  ParentMessage,
  IframeMessage,
  ConnectInitPayload,
} from './types';

export {
  HOSTED_APP_URL,
  MESSAGE_TYPES,
  EVENTS,
  ERROR_CODES,
  PROTOCOL_VERSION,
} from './constants';

/**
 * EightOSConnect — main SDK entry point.
 *
 * Usage:
 *   const instance = EightOSConnect.open({
 *     token: 'session_token_here',
 *     onSuccess: (data) => console.log('Connected:', data.connectionId),
 *     onError: (err) => console.error('Error:', err.code),
 *     onClose: () => console.log('Closed'),
 *   });
 *
 *   // Programmatic close:
 *   instance.close();
 */
export class EightOSConnect {
  /**
   * Open the Connect modal. Creates an overlay with an iframe
   * pointing to the hosted Connect app.
   */
  static open(options: ConnectOptions): ConnectInstance {
    // Fire "opened" analytics event
    options.onEvent?.({
      event: EVENTS.OPENED,
      timestamp: new Date().toISOString(),
    });

    // Create overlay and container
    const { overlay, container, cleanup: overlayCleanup } = createOverlay();

    // Create iframe inside container
    const url = resolveConnectAppUrl(options.connectAppUrl);
    const iframe = createIframe(url, container);

    // Set up cleanup function
    const cleanup = () => {
      window.removeEventListener('message', messageHandler);
      window.removeEventListener('keydown', escapeHandler);
      overlayCleanup();
    };

    // Set up message handler
    const messageHandler = createMessageHandler(iframe, options, cleanup);
    window.addEventListener('message', messageHandler);

    // Escape key closes the modal
    const escapeHandler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        sendMessage(iframe, MESSAGE_TYPES.CLOSE_REQUEST);
      }
    };
    window.addEventListener('keydown', escapeHandler);

    // Click outside closes (on overlay, not container)
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) {
        sendMessage(iframe, MESSAGE_TYPES.CLOSE_REQUEST);
      }
    });

    // Send init message once iframe loads
    iframe.addEventListener('load', () => {
      const trimmedBase = options.apiBaseUrl?.trim();
      const initPayload: Record<string, unknown> = {
        token: options.token,
        providerId: options.providerId,
        reconnect: options.reconnect,
        allowMultiple: options.allowMultiple,
      };
      if (trimmedBase) {
        initPayload.apiBaseUrl = normalizeConnectApiBaseUrl(trimmedBase);
      }
      // macrotask: iframe document's useLayoutEffect listeners should be attached first
      window.setTimeout(() => {
        sendMessage(iframe, MESSAGE_TYPES.INIT, initPayload);
      }, 0);
    });

    return {
      close: () => {
        sendMessage(iframe, MESSAGE_TYPES.CLOSE_REQUEST);
      },
    };
  }

  /**
   * Preload the hosted Connect app by adding a prefetch link.
   * Call this early (e.g., on page load) so the iframe loads faster
   * when open() is called later.
   */
  static preload(connectAppUrl?: string): void {
    const url = resolveConnectAppUrl(connectAppUrl);
    if (document.querySelector('link[href="' + url + '"]')) return;
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
  }
}
