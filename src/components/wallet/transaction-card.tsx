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
    <Card className="bg-white/5 backdrop-blur-xl border border-[#70C7BA]/20 hover:border-[#70C7BA]/40 transition-all duration-300 shadow-lg">
      <CardContent className="p-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Transaction Type Icon */}
            <div className={`p-1.5 rounded-full ${
              isDonation 
                ? 'bg-[#49EACB]/20 text-[#49EACB]' 
                : 'bg-orange-400/20 text-orange-400'
            }`}>
              {isDonation ? (
                <ArrowDownLeft className="w-3 h-3" />
              ) : (
                <ArrowUpRight className="w-3 h-3" />
              )}
            </div>

            {/* Transaction Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge 
                  variant={isDonation ? 'default' : 'secondary'}
                  className={`text-xs ${
                    isDonation 
                      ? 'bg-[#49EACB]/20 text-[#49EACB] hover:bg-[#49EACB]/30 border-[#49EACB]/30' 
                      : 'bg-orange-400/20 text-orange-400 hover:bg-orange-400/30 border-orange-400/30'
                  }`}
                >
                  {isDonation ? 'Donation' : 'Send'}
                </Badge>
                
                {!transaction.confirmed && (
                  <Badge variant="outline" className="text-xs text-yellow-400 border-yellow-400/30 bg-yellow-400/10">
                    <Clock className="w-3 h-3 mr-1" />
                    Pending
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>{formatDate(transaction.timestamp)}</span>
                <a
                  href={getKaspaExplorerUrl(transaction.hash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[#70C7BA] hover:text-[#49EACB] transition-colors"
                >
                  View <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Amount */}
          <div className="text-right">
            <div className={`text-sm font-bold ${
              isDonation ? 'text-[#49EACB]' : 'text-orange-400'
            }`}>
              {isDonation ? '+' : '-'}{transaction.formattedAmount} KAS
            </div>
            <div className="text-xs text-gray-400">
              ${(transaction.amountKas * 0.15).toFixed(2)} USD
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 