'use client';

import GitHubWalletConnect from '@/components/GitHubWalletConnect';

/**
 * Demo page for GitHub OAuth wallet integration
 */
export default function GitHubWalletPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-2">GitHub Wallet Connection</h1>
      <p className="text-gray-400 mb-8">
        Connect your GitHub account to create a deterministic Cosmos wallet
      </p>

      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10">
        <GitHubWalletConnect />
      </div>

      <div className="mt-8 space-y-4">
        <h2 className="text-2xl font-semibold">How It Works</h2>
        <div className="grid gap-4">
          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <h3 className="font-semibold text-lg mb-2">🔐 OAuth Login</h3>
            <p className="text-gray-400">
              Authenticate with GitHub using OAuth 2.0. Your credentials are
              handled securely by GitHub.
            </p>
          </div>

          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <h3 className="font-semibold text-lg mb-2">
              🔑 Deterministic Wallet
            </h3>
            <p className="text-gray-400">
              Your Cosmos wallet is generated deterministically from your GitHub
              ID. Same account = Same wallet every time.
            </p>
          </div>

          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <h3 className="font-semibold text-lg mb-2">
              💾 Session Persistence
            </h3>
            <p className="text-gray-400">
              Your wallet connection is saved locally. No need to
              re-authenticate on every visit.
            </p>
          </div>

          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <h3 className="font-semibold text-lg mb-2">🚀 DAO Ready</h3>
            <p className="text-gray-400">
              Ready to integrate with your DAO membership system. Link your
              GitHub contributions to your DAO identity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
