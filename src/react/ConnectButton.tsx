import React from 'react';
import { useConnect } from './useConnect';
import type { ConnectButtonProps } from './types';

/**
 * Pre-styled button that opens the Connect modal on click.
 *
 * Usage:
 *   <ConnectButton token={sessionToken} onSuccess={handleSuccess} />
 */
export function ConnectButton({
  label = 'Connect',
  className,
  style,
  disabled,
  ...connectOptions
}: ConnectButtonProps) {
  const { open } = useConnect(connectOptions);

  const isDisabled = disabled || !connectOptions.token;

  const defaultStyle: React.CSSProperties = {
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: 600,
    borderRadius: '8px',
    border: 'none',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    opacity: isDisabled ? 0.5 : 1,
    backgroundColor: '#2563eb',
    color: '#ffffff',
    transition: 'background-color 150ms ease',
    ...style,
  };

  return (
    <button
      type="button"
      onClick={open}
      disabled={isDisabled}
      className={className}
      style={defaultStyle}
      aria-label={label}
    >
      {label}
    </button>
  );
}
