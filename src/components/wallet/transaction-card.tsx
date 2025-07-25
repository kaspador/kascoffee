'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowDownLeft, ArrowUpRight, Clock, ExternalLink } from 'lucide-react';

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

interface TransactionCardProps {
  transaction: Transaction;
}

export function TransactionCard({ transaction }: TransactionCardProps) {
  const isDonation = transaction.type === 'donation';
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 12)}...${address.slice(-8)}`;
  };

  const getKaspaExplorerUrl = (hash: string) => {
    return `https://explorer.kaspa.org/txs/${hash}`;
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            {/* Transaction Type Icon */}
            <div className={`p-2 rounded-full ${
              isDonation 
                ? 'bg-green-500/10 text-green-400' 
                : 'bg-red-500/10 text-red-400'
            }`}>
              {isDonation ? (
                <ArrowDownLeft className="w-4 h-4" />
              ) : (
                <ArrowUpRight className="w-4 h-4" />
              )}
            </div>

            {/* Transaction Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge 
                  variant={isDonation ? 'default' : 'secondary'}
                  className={`text-xs ${
                    isDonation 
                      ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20' 
                      : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                  }`}
                >
                  {isDonation ? 'Donation' : 'Send'}
                </Badge>
                
                {!transaction.confirmed && (
                  <Badge variant="outline" className="text-xs text-yellow-400 border-yellow-400/20">
                    <Clock className="w-3 h-3 mr-1" />
                    Pending
                  </Badge>
                )}
              </div>

              <div className="text-sm text-zinc-400">
                {isDonation ? 'From: ' : 'To: '}
                <span className="font-mono text-xs">
                  {truncateAddress(isDonation ? transaction.fromAddress || 'Unknown' : transaction.toAddress || 'Unknown')}
                </span>
              </div>

              <div className="flex items-center gap-2 mt-1 text-xs text-zinc-500">
                <span>{formatDate(transaction.timestamp)}</span>
                <a
                  href={getKaspaExplorerUrl(transaction.hash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  View <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Amount */}
          <div className="text-right">
            <div className={`text-lg font-bold ${
              isDonation ? 'text-green-400' : 'text-red-400'
            }`}>
              {isDonation ? '+' : '-'}{transaction.formattedAmount} KAS
            </div>
            <div className="text-xs text-zinc-500">
              ${(transaction.amountKas * 0.15).toFixed(2)} USD
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 