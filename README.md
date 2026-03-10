# @universal_aggregator/connect

Connect SDK for embedding the provider connection flow into any web app.

## Installation

\`\`\`bash
npm install @universal_aggregator/connect
# or
pnpm add @universal_aggregator/connect
\`\`\`

## Usage

### Vanilla JS / TypeScript

\`\`\`ts
import { AggregatorConnect } from '@universal_aggregator/connect';

const instance = AggregatorConnect.open({
  token: 'your-session-token',
  onSuccess: (data) => console.log('Connected:', data),
  onError: (err) => console.error('Error:', err),
  onClose: () => console.log('Modal closed'),
});
\`\`\`

### React

\`\`\`tsx
import { ConnectButton } from '@universal_aggregator/connect/react';

<ConnectButton token="your-session-token" onSuccess={handleSuccess} />
\`\`\`

## License

MIT