'use client';

import { useGitHubWallet } from '@/hooks/useGitHubWallet';

/**
 * GitHub OAuth Wallet Connection Component
 *
 * Provides a UI for users to:
 * - Login with GitHub OAuth
 * - Automatically create a deterministic Cosmos wallet
 * - View wallet address and GitHub profile
 * - Logout
 */
export default function GitHubWalletConnect() {
  const { isLoading, isConnected, wallet, error, login, logout } =
    useGitHubWallet();

  if (isConnected && wallet) {
    return (
      <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
        <div className="flex items-center gap-3">
          {wallet.githubUser.avatar_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={wallet.githubUser.avatar_url}
              alt={wallet.githubUser.login}
              className="w-10 h-10 rounded-full"
            />
          )}
          <div className="flex flex-col">
            <div className="font-semibold text-white">
              {wallet.githubUser.name || wallet.githubUser.login}
            </div>
            <div className="text-sm text-gray-400">
              @{wallet.githubUser.login}
            </div>
          </div>
        </div>

        <div className="h-8 w-px bg-gray-600" />

        <div className="flex flex-col">
          <div className="text-xs text-gray-400 mb-1">Wallet Address</div>
          <div className="font-mono text-sm text-white bg-black/20 px-2 py-1 rounded">
            {wallet.address.slice(0, 12)}...{wallet.address.slice(-8)}
          </div>
        </div>

        <button
          onClick={logout}
          disabled={isLoading}
          className="ml-auto px-4 py-2 rounded-md border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-60"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={login}
        disabled={isLoading}
        className="px-6 py-3 rounded-lg bg-[#24292e] text-white font-semibold hover:bg-[#2c3238] transition-colors disabled:opacity-60 flex items-center gap-3"
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Connecting...
          </>
        ) : (
          <>
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            Connect with GitHub
          </>
        )}
      </button>

      <p className="text-sm text-gray-400 text-center max-w-md">
        Create a deterministic wallet linked to your GitHub identity. Same
        GitHub account = Same wallet every time.
      </p>

      {error && (
        <div className="text-red-400 text-sm mt-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded">
          {error}
        </div>
      )}
    </div>
  );
}
