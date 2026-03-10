/**
 * Create the modal overlay and container for the Connect iframe.
 * Desktop: centered modal (440px wide, max 680px tall).
 * Mobile: full-screen bottom sheet.
 */
export function createOverlay(): {
  overlay: HTMLDivElement;
  container: HTMLDivElement;
  cleanup: () => void;
} {
  const overlay = document.createElement('div');
  overlay.id = 'aggregator-connect-overlay';
  overlay.setAttribute('role', 'presentation');

  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: 999999;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    opacity: 0;
    transition: opacity 200ms ease;
  `;

  const container = document.createElement('div');
  container.id = 'aggregator-connect-container';

  const isMobile = window.innerWidth < 640;

  if (isMobile) {
    container.style.cssText = `
      width: 100%;
      height: 100%;
      max-height: 100%;
      border-radius: 0;
      overflow: hidden;
      background: white;
    `;
  } else {
    container.style.cssText = `
      width: 440px;
      max-height: 680px;
      height: 90vh;
      border-radius: 12px;
      overflow: hidden;
      background: white;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
      transform: translateY(10px);
      opacity: 0;
      transition: transform 200ms ease, opacity 200ms ease;
    `;
  }

  overlay.appendChild(container);
  document.body.appendChild(overlay);

  // Trigger entrance animation
  requestAnimationFrame(() => {
    overlay.style.opacity = '1';
    if (!isMobile) {
      container.style.transform = 'translateY(0)';
      container.style.opacity = '1';
    }
  });

  // Prevent body scroll while overlay is open
  const originalOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';

  const cleanup = () => {
    document.body.style.overflow = originalOverflow;
    overlay.remove();
  };

  return { overlay, container, cleanup };
}
