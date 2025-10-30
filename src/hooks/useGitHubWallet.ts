'use client';

import { useState, useCallback, useEffect } from 'react';
import type { GitHubUser } from '@/lib/wallet-derivation';

export interface WalletFromGitHub {
  address: string;
  githubUser: GitHubUser;
}

interface UseGitHubWalletReturn {
  isLoading: boolean;
  isConnected: boolean;
  wallet: WalletFromGitHub | null;
  error: string | null;
  login: () => void;
  logout: () => void;
}

/**
 * Custom hook for GitHub OAuth authentication and deterministic wallet creation
 *
 * Features:
 * - GitHub OAuth login flow
 * - Automatic wallet creation from GitHub ID
 * - Persistent session (localStorage)
 * - Deterministic wallet generation (same GitHub ID = same wallet)
 */
export function useGitHubWallet(): UseGitHubWalletReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [wallet, setWallet] = useState<WalletFromGitHub | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load wallet from localStorage on mount
  useEffect(() => {
    const loadStoredWallet = async () => {
      try {
        const stored = localStorage.getItem('github_wallet');
        if (stored) {
          const parsed = JSON.parse(stored);

          // Validate stored data
          if (parsed.githubUser?.id && parsed.address) {
            setWallet(parsed);
            setIsConnected(true);
          }
        }
      } catch (e) {
        console.error('Failed to load stored wallet:', e);
        localStorage.removeItem('github_wallet');
      }
    };

    loadStoredWallet();
  }, []);

  // Handle OAuth callback when redirected back from GitHub
  useEffect(() => {
    const handleOAuthCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const errorParam = urlParams.get('error');

      // Remove query params from URL
      if (code || errorParam) {
        window.history.replaceState({}, '', window.location.pathname);
      }

      if (errorParam) {
        setError(`OAuth error: ${errorParam}`);
        setIsLoading(false);
        return;
      }

      if (!code) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Exchange code for user data
        const response = await fetch(`/api/auth/github/callback?code=${code}`);

        if (!response.ok) {
          throw new Error('Failed to complete OAuth flow');
        }

        const data = await response.json();
        const { user, access_token } = data;

        // Create wallet from GitHub ID via API
        const walletResponse = await fetch('/api/wallet/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ githubId: user.id }),
        });

        if (!walletResponse.ok) {
          throw new Error('Failed to create wallet');
        }

        const walletData = await walletResponse.json();
        const { address } = walletData;

        // Store access token (optional - for future use)
        // In production, you might want to store this server-side
        if (access_token) {
          localStorage.setItem('github_access_token', access_token);
        }

        const walletInfo: WalletFromGitHub = {
          address,
          githubUser: user,
        };

        setWallet(walletInfo);
        setIsConnected(true);

        // Persist to localStorage
        localStorage.setItem('github_wallet', JSON.stringify(walletInfo));
      } catch (e) {
        const message =
          e instanceof Error ? e.message : 'Failed to create wallet';
        setError(message);
        console.error('OAuth callback error:', e);
      } finally {
        setIsLoading(false);
      }
    };

    handleOAuthCallback();
  }, []);

  /**
   * Initiate GitHub OAuth login flow
   */
  const login = useCallback(() => {
    setIsLoading(true);
    setError(null);

    // Redirect to GitHub OAuth authorization endpoint
    window.location.href = '/api/auth/github/authorize';
  }, []);

  /**
   * Logout and clear wallet data
   */
  const logout = useCallback(() => {
    setWallet(null);
    setIsConnected(false);
    setError(null);

    // Clear stored data
    localStorage.removeItem('github_wallet');
    localStorage.removeItem('github_access_token');
  }, []);

  return {
    isLoading,
    isConnected,
    wallet,
    error,
    login,
    logout,
  };
}
