import type { ConnectOptions, ConnectInstance } from './types';
import { HOSTED_APP_URL, MESSAGE_TYPES, EVENTS } from './constants';
import { createIframe } from './iframe';
import { createOverlay } from './overlay';
import { createMessageHandler, sendMessage } from './messaging';
import { buildHostedAppUrl } from './utils';

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

export { HOSTED_APP_URL, MESSAGE_TYPES, EVENTS, ERROR_CODES, PROTOCOL_VERSION } from './constants';

/**
 * AggregatorConnect — main SDK entry point.
 *
 * Usage:
 *   const instance = AggregatorConnect.open({
 *     token: 'session_token_here',
 *     onSuccess: (data) => console.log('Connected:', data.connectionId),
 *     onError: (err) => console.error('Error:', err.code),
 *     onClose: () => console.log('Closed'),
 *   });
 *
 *   // Programmatic close:
 *   instance.close();
 */
export class AggregatorConnect {
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
    const url = buildHostedAppUrl();
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
      sendMessage(iframe, MESSAGE_TYPES.INIT, {
        token: options.token,
        providerId: options.providerId,
        reconnect: options.reconnect,
        allowMultiple: options.allowMultiple,
      });
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
  static preload(): void {
    if (document.querySelector('link[href="' + HOSTED_APP_URL + '"]')) return;
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = HOSTED_APP_URL;
    document.head.appendChild(link);
  }
}
