# @routemcp/connect-sdk

Connect SDK for embedding the provider connection flow into any web app.

## Installation

```bash
npm install @routemcp/connect-sdk
# or
pnpm add @routemcp/connect-sdk
```

## Usage

### Vanilla JS / TypeScript

```ts
import { RouteMCPConnect } from '@routemcp/connect-sdk';

const instance = RouteMCPConnect.open({
  token: 'your-session-token',
  onSuccess: (data) => console.log('Connected:', data),
  onError: (err) => console.error('Error:', err),
  onClose: () => console.log('Modal closed'),
});
```

### React

```tsx
import { ConnectButton } from '@routemcp/connect-sdk/react';

<ConnectButton token="your-session-token" onSuccess={handleSuccess} />
```

## License

MIT