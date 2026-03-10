import type { ConnectOptions, ConnectErrorData } from '../types';

/** Options for the useConnect hook. token can be null when not yet available. */
export interface UseConnectOptions extends Omit<ConnectOptions, 'token'> {
  token: string | null;
}

/** Return value of the useConnect hook. */
export interface UseConnectReturn {
  /** Open the Connect modal. No-op if token is null. */
  open: () => void;
  /** True once the hosted app iframe has loaded and validated the token. */
  ready: boolean;
  /** Current error state, if any. Reset on close. */
  error: ConnectErrorData | null;
}

/** Props for the ConnectButton component. */
export interface ConnectButtonProps extends UseConnectOptions {
  /** Button label text. Default: "Connect" */
  label?: string;
  /** Additional CSS class name */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Whether the button is disabled */
  disabled?: boolean;
}
