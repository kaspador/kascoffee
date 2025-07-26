'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, TrendingUp, TrendingDown, Minus, RefreshCw } from 'lucide-react';
import { getKaspaPrice, formatUSD } from '@/lib/utils';

interface WalletBalanceProps {
  address: string;
}

interface BalanceData {
  address: string;
  balance: number;
  balanceKas: number;
  formattedBalance: string;
}

interface SnapshotData {
  balanceChange: number;
  changePercentage: number;
}

export function WalletBalance({ address }: WalletBalanceProps) {
  const [balance, setBalance] = useState<BalanceData | null>(null);
  const [change, setChange] = useState<SnapshotData | null>(null);
  const [kaspaPrice, setKaspaPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch current price and balance in parallel
      const [pricePromise, balancePromise] = await Promise.allSettled([
        getKaspaPrice(),
        fetch(`/api/wallet/balance/${encodeURIComponent(address)}`)
      ]);

      // Handle price fetch result
      if (pricePromise.status === 'fulfilled') {
        setKaspaPrice(pricePromise.value);
      } else {
        console.error('Failed to fetch Kaspa price:', pricePromise.reason);
        // Keep the previous price or set a fallback
        if (kaspaPrice === null) {
          setKaspaPrice(0.10); // Fallback price
        }
      }

      // Handle balance fetch result
      if (balancePromise.status === 'fulfilled') {
        const balanceResponse = balancePromise.value;
        if (!balanceResponse.ok) {
          throw new Error('Failed to fetch balance');
        }
        const balanceData = await balanceResponse.json();
        setBalance(balanceData);

        // Take a snapshot to get change data
        const snapshotResponse = await fetch(`/api/wallet/snapshot/${encodeURIComponent(address)}`, {
          method: 'POST'
        });
        if (snapshotResponse.ok) {
          const snapshotData = await snapshotResponse.json();
          setChange({
            balanceChange: snapshotData.balanceChange,
            changePercentage: snapshotData.changePercentage
          });
        }
      } else {
        throw new Error('Failed to fetch balance');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch wallet data');
    } finally {
      setLoading(false);
    }
  }, [address, kaspaPrice]);

  useEffect(() => {
    if (address) {
      fetchBalance();
      // Refresh balance every 5 minutes
      const interval = setInterval(fetchBalance, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [address, fetchBalance]);

  const formatUSDValue = (kas: number) => {
    const price = kaspaPrice || 0.10; // Use cached price or fallback
    return formatUSD(kas, price);
  };

  const getTrendIcon = () => {
    if (!change || change.balanceChange === 0) return <Minus className="w-4 h-4" />;
    return change.balanceChange > 0 
      ? <TrendingUp className="w-4 h-4" />
      : <TrendingDown className="w-4 h-4" />;
  };

  const getTrendColor = () => {
    if (!change || change.balanceChange === 0) return 'text-zinc-400';
    return change.balanceChange > 0 ? 'text-green-400' : 'text-red-400';
  };

  if (loading) {
    return (
      <Card className="bg-white/5 backdrop-blur-xl border border-[#70C7BA]/30 shadow-2xl h-fit w-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg text-white">
            <Wallet className="w-5 h-5 text-[#70C7BA]" />
            Wallet Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin text-[#70C7BA]" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-white/5 backdrop-blur-xl border border-[#70C7BA]/30 shadow-2xl h-fit w-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg text-white">
            <Wallet className="w-5 h-5 text-[#70C7BA]" />
            Wallet Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-sm text-red-400">{error}</p>
            <button
              onClick={fetchBalance}
              className="mt-2 text-xs text-[#70C7BA] hover:text-[#49EACB] transition-colors"
            >
              Try again
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/5 backdrop-blur-xl border border-[#70C7BA]/30 shadow-2xl h-fit w-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg text-white">
          <Wallet className="w-5 h-5 text-[#70C7BA]" />
          Wallet Balance
          <button
            onClick={fetchBalance}
            className="ml-auto p-1 rounded-md hover:bg-[#70C7BA]/20 transition-colors"
            title="Refresh balance"
          >
            <RefreshCw className="w-4 h-4 text-[#70C7BA]" />
          </button>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-4">
        {balance && (
          <div className="space-y-4">
            {/* Current Balance */}
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {balance.formattedBalance} KAS
              </div>
              <div className="text-lg text-gray-300">
                ≈ ${formatUSDValue(balance.balanceKas)} USD
                {kaspaPrice && (
                  <div className="text-xs text-gray-400 mt-1">
                    @ ${kaspaPrice.toFixed(4)}/KAS
                  </div>
                )}
              </div>
            </div>

            {/* Balance Change */}
            {change && (
              <div className="flex items-center justify-center gap-2 py-2">
                <div className={`flex items-center gap-1 ${getTrendColor()}`}>
                  {getTrendIcon()}
                  <span className="text-sm font-medium">
                    {change.balanceChange > 0 ? '+' : ''}
                    {change.balanceChange.toFixed(8)} KAS
                  </span>
                </div>
                
                {change.changePercentage !== 0 && (
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getTrendColor()} border-current`}
                  >
                    {change.changePercentage > 0 ? '+' : ''}
                    {change.changePercentage.toFixed(2)}%
                  </Badge>
                )}
                
                <span className="text-xs text-gray-400">since last hour</span>
              </div>
            )}

            {/* Address - Compact */}
            <div className="pt-3 border-t border-[#70C7BA]/20">
              <div className="text-xs text-gray-400 mb-2 text-center">Wallet Address</div>
              <div className="font-mono text-xs text-gray-300 break-all bg-black/20 p-3 rounded text-center">
                {balance.address}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 