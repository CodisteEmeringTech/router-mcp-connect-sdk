import { useCallback, useRef, useState } from 'react';
import { AggregatorConnect } from '../index';
import type { ConnectInstance, ConnectErrorData } from '../types';
import type { UseConnectOptions, UseConnectReturn } from './types';

/**
 * React hook for the Connect SDK.
 *
 * Usage:
 *   const { open, ready, error } = useConnect({
 *     token: sessionToken,
 *     onSuccess: (data) => console.log('Connected:', data.connectionId),
 *   });
 *
 *   return <button onClick={open} disabled={!token}>Connect</button>;
 */
export function useConnect(options: UseConnectOptions): UseConnectReturn {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<ConnectErrorData | null>(null);
  const instanceRef = useRef<ConnectInstance | null>(null);

  // Stable reference to current options (avoids stale closures)
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const open = useCallback(() => {
    const opts = optionsRef.current;
    if (!opts.token) return;

    // Reset state
    setReady(false);
    setError(null);

    instanceRef.current = AggregatorConnect.open({
      token: opts.token,
      onSuccess: opts.onSuccess,
      onError: (err) => {
        setError(err);
        opts.onError?.(err);
      },
      onClose: (data) => {
        setReady(false);
        instanceRef.current = null;
        opts.onClose?.(data);
      },
      onEvent: (event) => {
        // Hosted app sent connect:ready — token validated, iframe ready
        if (event.event === 'connect.ready') {
          setReady(true);
        }
        opts.onEvent?.(event);
      },
      providerId: opts.providerId,
      reconnect: opts.reconnect,
      allowMultiple: opts.allowMultiple,
    });
  }, []);

  return { open, ready, error };
}
