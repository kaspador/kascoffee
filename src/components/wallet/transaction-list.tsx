'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TransactionCard } from './transaction-card';
import { History, RefreshCw } from 'lucide-react';

interface Transaction {
  id: string;
  hash: string;
  timestamp: number;
  type: 'donation' | 'send';
  amount: number;
  amountKas: number;
  formattedAmount: string;
  fromAddress?: string;
  toAddress?: string;
  confirmed: boolean;
}

interface TransactionListProps {
  address: string;
  limit?: number;
}

export function TransactionList({ address, limit = 10 }: TransactionListProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/wallet/transactions/${encodeURIComponent(address)}?limit=${showAll ? 50 : limit}`);
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      
      const data = await response.json();
      setTransactions(data.transactions || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  }, [address, showAll, limit]);

  useEffect(() => {
    if (address) {
      fetchTransactions();
      // Refresh transactions every 2 minutes
      const interval = setInterval(fetchTransactions, 2 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [address, showAll, limit, fetchTransactions]);

  const displayedTransactions = showAll ? transactions : transactions.slice(0, limit);
  const donations = transactions.filter(tx => tx.type === 'donation');
  const sends = transactions.filter(tx => tx.type === 'send');

  if (loading) {
    return (
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <History className="w-5 h-5 text-[#70C7BA]" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin text-zinc-400" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <History className="w-5 h-5 text-[#70C7BA]" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-sm text-red-400 mb-2">{error}</p>
            <Button
              onClick={fetchTransactions}
              variant="outline"
              size="sm"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              Try again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <History className="w-5 h-5 text-[#70C7BA]" />
          Recent Activity
          <button
            onClick={fetchTransactions}
            className="ml-auto p-1 rounded-md hover:bg-zinc-800 transition-colors"
            title="Refresh transactions"
          >
            <RefreshCw className="w-4 h-4 text-zinc-400" />
          </button>
        </CardTitle>
        
        {/* Transaction Summary */}
        {transactions.length > 0 && (
          <div className="flex items-center gap-4 text-sm text-zinc-400">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              {donations.length} donations
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-red-400 rounded-full"></span>
              {sends.length} sends
            </span>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <History className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-400 mb-2">No transactions found</p>
            <p className="text-xs text-zinc-500">
              Transactions will appear here once the wallet has activity
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedTransactions.map((transaction) => (
              <TransactionCard key={transaction.id} transaction={transaction} />
            ))}
            
            {/* Show More/Less Button */}
            {transactions.length > limit && (
              <div className="pt-3 border-t border-zinc-800">
                <Button
                  onClick={() => setShowAll(!showAll)}
                  variant="outline"
                  size="sm"
                  className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                >
                  {showAll ? 'Show Less' : `Show All ${transactions.length} Transactions`}
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 