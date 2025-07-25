import { NextRequest, NextResponse } from 'next/server';

interface TransactionInput {
  previous_outpoint_address: string | null;
  previous_outpoint_amount: number | null;
}

interface TransactionOutput {
  amount: number;
  script_public_key_address: string;
}

interface KaspaTransaction {
  transaction_id: string;
  hash: string;
  block_time: number;
  accepting_block_time: number;
  is_accepted: boolean;
  inputs: TransactionInput[];
  outputs: TransactionOutput[];
}

interface ProcessedTransaction {
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

export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '20';
    
    if (!address) {
      return NextResponse.json(
        { error: 'Address is required' },
        { status: 400 }
      );
    }

    // Ensure address has kaspa: prefix for API call
    const kaspaAddress = address.startsWith('kaspa:') ? address : `kaspa:${address}`;
    const encodedAddress = encodeURIComponent(kaspaAddress);
    
    // Fetch transactions from Kaspa API
    const response = await fetch(
      `https://api.kaspa.org/addresses/${encodedAddress}/full-transactions-page?limit=${limit}&before=0&after=0&resolve_previous_outpoints=no`,
      {
        headers: {
          'accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Address not found' },
          { status: 404 }
        );
      }
      throw new Error(`Kaspa API error: ${response.status}`);
    }

    const transactions: KaspaTransaction[] = await response.json();
    
    // Process transactions to determine type and relevant amounts
    const processedTransactions: ProcessedTransaction[] = transactions
      .filter(tx => {
        // Only include transactions where the user's address appears in outputs (incoming/donations)
        return tx.outputs.some(output => output.script_public_key_address === kaspaAddress);
      })
      .map(tx => {
        // Find the output to the user's address
        const outputToUser = tx.outputs.find(output => 
          output.script_public_key_address === kaspaAddress
        )!; // We know this exists because of the filter above
        
        const amountKas = outputToUser.amount / 100000000;
        
        return {
          id: tx.transaction_id,
          hash: tx.hash,
          timestamp: tx.accepting_block_time || tx.block_time,
          type: 'donation' as const,
          amount: outputToUser.amount,
          amountKas,
          formattedAmount: amountKas.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 8
          }),
          fromAddress: 'Unknown', // Cannot resolve sender without previous outpoints
          toAddress: kaspaAddress,
          confirmed: tx.is_accepted
        };
      });
    
    // Sort by timestamp (newest first)
    processedTransactions.sort((a, b) => b.timestamp - a.timestamp);
    
    return NextResponse.json({
      transactions: processedTransactions,
      count: processedTransactions.length
    });
  } catch (error) {
    console.error('Transactions fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wallet transactions' },
      { status: 500 }
    );
  }
} 