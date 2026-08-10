/**
 * Create the Connect iframe with security sandbox attributes.
 * The iframe loads the hosted Connect app in an isolated browser context.
 */
export function createIframe(url: string, container: HTMLElement): HTMLIFrameElement {
  const iframe = document.createElement('iframe');

  iframe.src = url;
  iframe.id = 'eightos-connect-iframe';
  iframe.title = 'Connect your account';

  // Security: minimal sandbox permissions.
  //
  // The OAuth popup must escape this sandbox to load successfully against
  // providers that front their consent endpoint with bot-challenge layers.
  // Concrete case: FreshBooks routes `auth.freshbooks.com/oauth/authorize`
  // through reCAPTCHA Enterprise, whose challenge page ships
  //   Cross-Origin-Opener-Policy: same-origin
  //   Cross-Origin-Resource-Policy: same-site
  //   X-Frame-Options: SAMEORIGIN
  // (verified 2026-05-22 against the live endpoint). A sandbox-inherited
  // popup has an opaque origin, so the browser refuses to render any of
  // those headers and surfaces `(blocked:Sandbox)` + `(blocked:origin)` in
  // the Network panel — never reaching the consent screen.
  //
  // `allow-popups-to-escape-sandbox` only changes popup behaviour: the
  // popup runs with a real origin and normal storage, while the iframe
  // itself stays as sandboxed as before. This is the spec-intended escape
  // hatch for embedded-widget OAuth flows (Plaid Link / Stripe Connect /
  // etc. all use it).
  iframe.sandbox.add('allow-scripts');
  iframe.sandbox.add('allow-same-origin');
  iframe.sandbox.add('allow-forms');
  iframe.sandbox.add('allow-popups');
  iframe.sandbox.add('allow-popups-to-escape-sandbox');

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
