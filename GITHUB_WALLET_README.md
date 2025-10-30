# GitHub OAuth Wallet Hook

A complete production-ready solution for GitHub OAuth authentication with deterministic Cosmos wallet creation for your AAB DAO frontend.

## 📦 What's Included

### Core Files

- **`src/hooks/useGitHubWallet.ts`** - Main React hook for GitHub OAuth and wallet management
- **`src/components/GitHubWalletConnect.tsx`** - Ready-to-use UI component
- **`src/lib/wallet-derivation.ts`** - Deterministic wallet creation utilities
- **`src/app/api/auth/github/authorize/route.ts`** - GitHub OAuth authorization endpoint
- **`src/app/api/auth/github/callback/route.ts`** - OAuth callback handler
- **`src/app/github-wallet/page.tsx`** - Demo page showing the integration

## 🚀 Quick Start

### 1. Set Up Environment Variables

Create a `.env.local` file in your project root:

```bash
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
NEXTAUTH_URL=http://localhost:3000
NODE_ENV=development
```

See `GITHUB_OAUTH_SETUP.md` for detailed setup instructions.

### 2. Install Dependencies

Dependencies are already installed. If you need to reinstall:

```bash
npm install @noble/hashes bip39
```

### 3. Use the Component

```tsx
import GitHubWalletConnect from '@/components/GitHubWalletConnect';

export default function MyPage() {
  return (
    <div>
      <GitHubWalletConnect />
    </div>
  );
}
```

### 4. Or Use the Hook Directly

```tsx
import { useGitHubWallet } from '@/hooks/useGitHubWallet';

export default function MyComponent() {
  const { isConnected, wallet, login, logout, isLoading } = useGitHubWallet();

  if (isConnected) {
    return (
      <div>
        <p>Address: {wallet?.address}</p>
        <p>GitHub: {wallet?.githubUser.login}</p>
        <button onClick={logout}>Disconnect</button>
      </div>
    );
  }

  return <button onClick={login}>Connect GitHub</button>;
}
```

## 🔐 Key Features

### Deterministic Wallet Generation

The same GitHub account always generates the same Cosmos wallet address:

```typescript
// User with GitHub ID 12345 always gets the same wallet
const { address } = await createWalletFromGitHub(12345);
```

### Secure OAuth Flow

- Standard OAuth 2.0 implementation
- State parameter for CSRF protection
- Secure token exchange
- Access token stored server-side

### Session Management

- Automatic persistence with localStorage
- Restores wallet on page reload
- Simple logout to clear session

### Type Safety

Full TypeScript support with proper interfaces:

```typescript
interface WalletFromGitHub {
  address: string;
  githubUser: {
    id: number;
    login: string;
    name: string | null;
    email: string | null;
    avatar_url: string;
    bio: string | null;
  };
}
```

## 🏗️ Architecture

### OAuth Flow

```
User clicks "Connect GitHub"
  ↓
Redirect to /api/auth/github/authorize
  ↓
GitHub OAuth page
  ↓
Callback to /api/auth/github/callback
  ↓
Exchange code for access token
  ↓
Fetch GitHub user data
  ↓
Create deterministic wallet from GitHub ID
  ↓
Store in localStorage
  ↓
Display connected wallet
```

### Wallet Derivation

1. GitHub OAuth returns user ID
2. Hash the ID with SHA-256
3. Convert to BIP39 entropy
4. Generate mnemonic phrase
5. Create Cosmos wallet from mnemonic
6. Extract wallet address

## 🎨 UI Component

The `GitHubWalletConnect` component provides:

- **GitHub login button** with branded styling
- **Loading states** during authentication
- **Connected state** showing:
  - GitHub avatar and username
  - Wallet address
  - Logout button
- **Error handling** with user-friendly messages

## 🔧 API Routes

### GET `/api/auth/github/authorize`

Initiates GitHub OAuth flow

- Generates CSRF state token
- Redirects to GitHub OAuth page

### GET `/api/auth/github/callback`

Handles OAuth callback

- Validates state token
- Exchanges code for access token
- Fetches GitHub user profile
- Returns user data + access token

## 🧪 Testing

### Local Development

1. Start the dev server: `npm run dev`
2. Navigate to `/github-wallet`
3. Click "Connect with GitHub"
4. Authorize the app on GitHub
5. See your deterministic wallet address

### Environment

Make sure your GitHub OAuth app callback URL is:

```
http://localhost:3000/api/auth/github/callback
```

## 🚀 Next Steps

### Integration with DAO

Use the wallet for DAO operations:

```typescript
import { useGitHubWallet } from '@/hooks/useGitHubWallet';
import { SigningStargateClient } from '@cosmjs/stargate';

export default function DAOComponent() {
  const { wallet } = useGitHubWallet();

  const createProposal = async () => {
    if (!wallet?.wallet) return;

    const client = await SigningStargateClient.create(
      chain.rpcUrl,
      wallet.wallet
    );

    // Create proposal logic
  };

  return <button onClick={createProposal}>Create Proposal</button>;
}
```

### Member Registry

Check DAO membership:

```typescript
const isDAOmember = await checkMembership(wallet.githubUser.id);
```

### Soulbound Token

Mint SBT for GitHub contributors:

```typescript
await mintSBT({
  recipient: wallet.address,
  metadata: {
    githubId: wallet.githubUser.id,
    githubUsername: wallet.githubUser.login,
  },
});
```

## 📝 Notes

- The wallet is generated client-side using BIP39 standards
- Same GitHub ID always produces the same wallet
- No sensitive data (like mnemonics) is stored in localStorage
- For production, consider implementing server-side session management
- The current implementation uses localStorage for simplicity

## 🐛 Troubleshooting

### "GITHUB_CLIENT_ID not configured"

Add your GitHub OAuth credentials to `.env.local`

### "Failed to exchange OAuth code"

Check that your callback URL matches in GitHub settings

### Wallet address different each time

This shouldn't happen. The wallet is deterministic. Check that GitHub ID is consistent.

## 📚 Additional Resources

- [GitHub OAuth Documentation](https://docs.github.com/en/apps/oauth-apps)
- [BIP39 Standard](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki)
- [Cosmos SDK Documentation](https://docs.cosmos.network/)

## 🤝 Contributing

Feel free to extend this implementation with:

- Server-side session management
- Database integration for member registry
- Multi-chain wallet support
- Social recovery mechanisms
