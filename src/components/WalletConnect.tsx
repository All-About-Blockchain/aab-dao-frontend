'use client';

import { useCallback, useEffect, useState } from 'react';
import { connectKeplr, getAtomBalance } from '@/lib/wallet';
import { getDefaultChain, formatAmount } from '@/lib/chains';

export default function WalletConnect() {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chain = getDefaultChain();

  const handleConnect = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { address } = await connectKeplr();
      setAddress(address);
      const base = await getAtomBalance(address);
      setBalance(formatAmount(base, chain.displayExponent));
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      setError(message || 'Failed to connect wallet');
    } finally {
      setLoading(false);
    }
  }, [chain.displayExponent]);

  const handleDisconnect = useCallback(() => {
    setAddress(null);
    setBalance(null);
    setError(null);
  }, []);

  useEffect(() => {
    // No auto-connect for simplicity
  }, []);

  return (
    <div className="flex items-center gap-6">
      {!address ? (
        <button
          onClick={handleConnect}
          disabled={loading}
          className="px-4 py-2 rounded-md bg-white text-black disabled:opacity-60 border border-gray-300 cursor-pointer"
        >
          {loading ? 'Connecting...' : 'Connect Keplr'}
        </button>
      ) : (
        <div className="flex items-center gap-4">
          <div className="px-3 py-2 rounded-md">
            {address.slice(0, 10)}...{address.slice(-6)}
          </div>
          <div className="px-3 py-2 rounded-md">
            {balance ?? '-'} {chain.displayDenom}
          </div>
          <button
            onClick={handleDisconnect}
            className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 cursor-pointer"
          >
            Disconnect
          </button>
        </div>
      )}
      {error && (
        <span className="text-red-600 text-sm" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
