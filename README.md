# @eightos/connect-sdk

Connect SDK for embedding the provider connection flow into any web app.

## Installation

```bash
npm install @eightos/connect-sdk
# or
pnpm add @eightos/connect-sdk
```

## Usage

### Vanilla JS / TypeScript

```ts
import { EightOSConnect } from '@eightos/connect-sdk';

const instance = EightOSConnect.open({
  token: 'your-session-token',
  /** Backend origin (no trailing slash). Sent to the connect-page so API calls match your app. */
  apiBaseUrl: 'https://api.example.com',
  /** Connect iframe app URL; omit to use SDK build default (CONNECT_APP_URL). */
  connectAppUrl: 'http://localhost:3100',
  onSuccess: (data) => console.log('Connected:', data),
  onError: (err) => console.error('Error:', err),
  onClose: () => console.log('Modal closed'),
});
```

### React

```tsx
import { ConnectButton } from '@eightos/connect-sdk/react';

<ConnectButton
  token="your-session-token"
  apiBaseUrl="https://api.example.com"
  connectAppUrl="http://localhost:3100"
  onSuccess={handleSuccess}
/>
```

**Hosted-link mode** (`?token=` only, no iframe): pass the same origin on the connect-page URL as `?apiBase=` (URL-encoded) if it differs from `VITE_API_BASE_URL` at build time.

## License

MIT