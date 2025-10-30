/**
 * Type definitions for wallet derivation
 * Note: Actual wallet creation happens server-side via /api/wallet/create
 */

/**
 * Type definitions for GitHub OAuth data
 */
export interface GitHubUser {
  id: number;
  login: string;
  name: string | null;
  email: string | null;
  avatar_url: string;
  bio: string | null;
}

export interface WalletFromGitHub {
  address: string;
  githubUser: GitHubUser;
}
