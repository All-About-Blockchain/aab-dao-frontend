# GitHub OAuth Setup Guide

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# GitHub OAuth Configuration
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here

# App Configuration
NEXTAUTH_URL=http://localhost:3000
NODE_ENV=development
```

## How to Get GitHub OAuth Credentials

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the following:
   - **Application name**: AAB DAO (or your preferred name)
   - **Homepage URL**: `http://localhost:3000` (or your production URL)
   - **Authorization callback URL**: `http://localhost:3000/api/auth/github/callback`
4. Click "Register application"
5. Copy the **Client ID** and generate a **Client Secret**
6. Add these to your `.env.local` file

## How to Use

### 1. In your component:

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

### 2. Use the hook directly:

```tsx
import { useGitHubWallet } from '@/hooks/useGitHubWallet';

export default function MyComponent() {
  const { isConnected, wallet, login, logout, isLoading } = useGitHubWallet();

  if (isConnected) {
    return (
      <div>
        <p>Wallet Address: {wallet?.address}</p>
        <p>GitHub: {wallet?.githubUser.login}</p>
        <button onClick={logout}>Logout</button>
      </div>
    );
  }

  return <button onClick={login}>Connect GitHub</button>;
}
```

## Features

- **Deterministic Wallet**: Same GitHub account always generates the same Cosmos wallet
- **Secure OAuth Flow**: Standard OAuth 2.0 flow with GitHub
- **Session Persistence**: Wallet data stored in localStorage
- **Type-Safe**: Full TypeScript support
- **Production Ready**: Includes error handling and loading states

## Architecture

- **`src/hooks/useGitHubWallet.ts`**: Main hook for GitHub OAuth and wallet management
- **`src/components/GitHubWalletConnect.tsx`**: Ready-to-use UI component
- **`src/lib/wallet-derivation.ts`**: Utility functions for deterministic wallet creation
- **`src/app/api/auth/github/authorize/route.ts`**: GitHub OAuth authorization endpoint
- **`src/app/api/auth/github/callback/route.ts`**: OAuth callback handler

## Security Notes

- Never expose `GITHUB_CLIENT_SECRET` to the frontend
- Consider implementing server-side session management for production
- The current implementation stores minimal data in localStorage for simplicity
- For production, consider using httpOnly cookies or a proper session store

## Next Steps

1. Set up your GitHub OAuth App
2. Add credentials to `.env.local`
3. Use the `GitHubWalletConnect` component in your app
4. Test the login flow
5. Integrate with your DAO membership system
