export type ChainId = 'cosmoshub-4';

export interface ChainConfig {
  chainId: ChainId;
  chainName: string;
  rpcUrl: string;
  restUrl: string;
  stakeDenom: string; // on-chain base denom
  displayDenom: string; // human readable denom
  displayExponent: number; // exponent to convert base -> display
}

const COSMOSHUB_MAINNET: ChainConfig = {
  chainId: 'cosmoshub-4',
  chainName: 'Cosmos Hub',
  rpcUrl: 'https://rpc.cosmos.directory/cosmoshub',
  restUrl: 'https://rest.cosmos.directory/cosmoshub',
  stakeDenom: 'uatom',
  displayDenom: 'ATOM',
  displayExponent: 6,
};

export function getDefaultChain(): ChainConfig {
  return COSMOSHUB_MAINNET;
}

export function formatAmount(baseAmount: string, exponent: number): string {
  const n = Number(baseAmount);
  if (!Number.isFinite(n)) return '0';
  return (n / 10 ** exponent).toString();
}
