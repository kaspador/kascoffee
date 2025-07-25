import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;
    
    if (!address) {
      return NextResponse.json(
        { error: 'Address is required' },
        { status: 400 }
      );
    }

    // Ensure address has kaspa: prefix for API call
    const kaspaAddress = address.startsWith('kaspa:') ? address : `kaspa:${address}`;
    const encodedAddress = encodeURIComponent(kaspaAddress);
    
    // Fetch balance from Kaspa API
    const response = await fetch(
      `https://api.kaspa.org/addresses/${encodedAddress}/balance`,
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

    const data = await response.json();
    
    // Convert balance from smallest unit (8 decimals) to KAS
    const balanceInKas = data.balance / 100000000;
    
    return NextResponse.json({
      address: data.address,
      balance: data.balance, // Raw balance for storage
      balanceKas: balanceInKas, // Human readable balance
      formattedBalance: balanceInKas.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 8
      })
    });
  } catch (error) {
    console.error('Balance fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wallet balance' },
      { status: 500 }
    );
  }
} 