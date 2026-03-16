# @routermcp/connect-sdk

Connect SDK for embedding the provider connection flow into any web app.

## Installation

```bash
npm install @routermcp/connect-sdk
# or
pnpm add @routermcp/connect-sdk
```

## Usage

### Vanilla JS / TypeScript

```ts
import { RouteMCPConnect } from '@routermcp/connect-sdk';

const instance = RouteMCPConnect.open({
  token: 'your-session-token',
  onSuccess: (data) => console.log('Connected:', data),
  onError: (err) => console.error('Error:', err),
  onClose: () => console.log('Modal closed'),
});
```

### React

```tsx
import { ConnectButton } from '@routermcp/connect-sdk/react';

<ConnectButton token="your-session-token" onSuccess={handleSuccess} />
```

## License

MIT