/**
 * Create the Connect iframe with security sandbox attributes.
 * The iframe loads the hosted Connect app in an isolated browser context.
 */
export function createIframe(url: string, container: HTMLElement): HTMLIFrameElement {
  const iframe = document.createElement('iframe');

  iframe.src = url;
  iframe.id = 'aggregator-connect-iframe';
  iframe.title = 'Connect your account';

  // Security: minimal sandbox permissions
  iframe.sandbox.add('allow-scripts');
  iframe.sandbox.add('allow-same-origin');
  iframe.sandbox.add('allow-forms');
  iframe.sandbox.add('allow-popups');

  // Permissions policy
  iframe.allow = 'clipboard-write';

  // Styling: fill the container
  iframe.style.cssText = `
    width: 100%;
    height: 100%;
    border: none;
    background: transparent;
  `;

  // Accessibility
  iframe.setAttribute('role', 'dialog');
  iframe.setAttribute('aria-label', 'Connect your account');
  iframe.setAttribute('aria-modal', 'true');

  container.appendChild(iframe);
  return iframe;
}
