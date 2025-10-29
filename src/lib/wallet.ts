import { getDefaultChain } from './chains';
import { SigningStargateClient, StargateClient } from '@cosmjs/stargate';
import type { OfflineSigner } from '@cosmjs/proto-signing';
import type { Keplr } from '@keplr-wallet/types';

declare global {
  interface Window {
    keplr?: Keplr;
    getOfflineSignerAuto?: (
      chainId: string
    ) => Promise<OfflineSigner> | OfflineSigner;
  }
}

export interface ConnectedWallet {
  address: string;
  stargate: StargateClient;
  signingClient?: SigningStargateClient;
}

export async function isKeplrAvailable(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  return !!window.keplr && !!window.getOfflineSignerAuto;
}

export async function enableKeplr(chainId: string): Promise<void> {
  if (!(await isKeplrAvailable())) throw new Error('Keplr not available');
  await window.keplr.enable(chainId);
}

export async function connectKeplr(): Promise<ConnectedWallet> {
  const chain = getDefaultChain();
  await enableKeplr(chain.chainId);

  const offlineSigner = await window.getOfflineSignerAuto!(chain.chainId);
  const accounts = await offlineSigner.getAccounts();
  const address = accounts[0]?.address;
  if (!address) throw new Error('No account found');

  const stargate = await StargateClient.connect(chain.rpcUrl);
  return { address, stargate };
}

export async function getAtomBalance(address: string): Promise<string> {
  const chain = getDefaultChain();
  const client = await StargateClient.connect(chain.rpcUrl);
  const balance = await client.getBalance(address, chain.stakeDenom);
  return balance.amount;
}
