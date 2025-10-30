import { NextRequest, NextResponse } from 'next/server';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { getDefaultChain } from '@/lib/chains';
import { entropyToMnemonic } from 'bip39';
import crypto from 'crypto';

/**
 * Derives a deterministic wallet seed from GitHub user ID
 * This ensures the same GitHub account always generates the same wallet
 */
function deriveWalletSeed(githubId: string | number): string {
  const idString = typeof githubId === 'number' ? githubId.toString() : githubId;
  const hash = crypto.createHash('sha256').update(idString).digest();
  return hash.toString('hex');
}

/**
 * Creates a deterministic mnemonic phrase from GitHub ID using BIP39
 */
function generateMnemonicFromGitHubId(githubId: string | number): string {
  const seed = deriveWalletSeed(githubId);
  const entropy = Buffer.from(seed, 'hex').slice(0, 16);
  const mnemonic = entropyToMnemonic(entropy.toString('hex'));
  return mnemonic;
}

/**
 * Creates a Cosmos wallet from GitHub OAuth identity
 * This wallet is deterministic - same GitHub ID = same wallet
 */
async function createWalletFromGitHub(githubId: string | number): Promise<string> {
  const mnemonic = generateMnemonicFromGitHubId(githubId);
  
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
    prefix: 'cosmos',
  });

  const accounts = await wallet.getAccounts();
  const address = accounts[0]?.address;

  if (!address) {
    throw new Error('Failed to generate wallet address');
  }

  return address;
}

/**
 * POST /api/wallet/create
 * Creates a deterministic wallet from GitHub ID
 */
export async function POST(request: NextRequest) {
  try {
    const { githubId } = await request.json();

    if (!githubId) {
      return NextResponse.json(
        { error: 'GitHub ID is required' },
        { status: 400 }
      );
    }

    const address = await createWalletFromGitHub(githubId);

    return NextResponse.json({ address });
  } catch (error) {
    console.error('Wallet creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create wallet' },
      { status: 500 }
    );
  }
}

