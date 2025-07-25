import { NextRequest, NextResponse } from 'next/server';

interface BalanceSnapshot {
  address: string;
  balance: number;
  balanceKas: number;
  timestamp: number;
  hour: string; // Format: YYYY-MM-DD-HH for easy grouping
}

// In-memory storage for balance snapshots (in production, use database)
const balanceHistory = new Map<string, BalanceSnapshot[]>();

// Clean up old snapshots (keep last 30 days)
setInterval(() => {
  const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
  
  for (const [address, snapshots] of balanceHistory.entries()) {
    const filtered = snapshots.filter(snapshot => snapshot.timestamp > thirtyDaysAgo);
    if (filtered.length === 0) {
      balanceHistory.delete(address);
    } else {
      balanceHistory.set(address, filtered);
    }
  }
}, 24 * 60 * 60 * 1000); // Run daily

export async function POST(
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
    
    // Fetch current balance from Kaspa API
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
    const balanceInKas = data.balance / 100000000;
    const now = Date.now();
    const hour = new Date(now).toISOString().slice(0, 13); // YYYY-MM-DDTHH
    
    // Create snapshot
    const snapshot: BalanceSnapshot = {
      address: kaspaAddress,
      balance: data.balance,
      balanceKas: balanceInKas,
      timestamp: now,
      hour
    };
    
    // Get existing snapshots for this address
    const addressSnapshots = balanceHistory.get(kaspaAddress) || [];
    
    // Check if we already have a snapshot for this hour
    const existingHourSnapshot = addressSnapshots.find(s => s.hour === hour);
    
    if (existingHourSnapshot) {
      // Update existing snapshot
      existingHourSnapshot.balance = data.balance;
      existingHourSnapshot.balanceKas = balanceInKas;
      existingHourSnapshot.timestamp = now;
    } else {
      // Add new snapshot
      addressSnapshots.push(snapshot);
      // Keep only last 24*30 = 720 hours (30 days)
      if (addressSnapshots.length > 720) {
        addressSnapshots.shift();
      }
    }
    
    balanceHistory.set(kaspaAddress, addressSnapshots);
    
    // Calculate balance change from previous snapshot
    let balanceChange = 0;
    let changePercentage = 0;
    if (addressSnapshots.length > 1) {
      const previousSnapshot = addressSnapshots[addressSnapshots.length - 2];
      balanceChange = balanceInKas - previousSnapshot.balanceKas;
      if (previousSnapshot.balanceKas > 0) {
        changePercentage = (balanceChange / previousSnapshot.balanceKas) * 100;
      }
    }
    
    return NextResponse.json({
      snapshot,
      balanceChange,
      changePercentage,
      totalSnapshots: addressSnapshots.length
    });
  } catch (error) {
    console.error('Snapshot creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create balance snapshot' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;
    const { searchParams } = new URL(request.url);
    const hours = parseInt(searchParams.get('hours') || '24');
    
    if (!address) {
      return NextResponse.json(
        { error: 'Address is required' },
        { status: 400 }
      );
    }

    const kaspaAddress = address.startsWith('kaspa:') ? address : `kaspa:${address}`;
    const addressSnapshots = balanceHistory.get(kaspaAddress) || [];
    
    // Filter snapshots by requested time range
    const cutoffTime = Date.now() - (hours * 60 * 60 * 1000);
    const recentSnapshots = addressSnapshots.filter(snapshot => 
      snapshot.timestamp >= cutoffTime
    );
    
    // Calculate statistics
    let minBalance = Infinity;
    let maxBalance = -Infinity;
    let totalChange = 0;
    
    if (recentSnapshots.length > 0) {
      minBalance = Math.min(...recentSnapshots.map(s => s.balanceKas));
      maxBalance = Math.max(...recentSnapshots.map(s => s.balanceKas));
      
      if (recentSnapshots.length > 1) {
        const firstSnapshot = recentSnapshots[0];
        const lastSnapshot = recentSnapshots[recentSnapshots.length - 1];
        totalChange = lastSnapshot.balanceKas - firstSnapshot.balanceKas;
      }
    }
    
    return NextResponse.json({
      snapshots: recentSnapshots,
      count: recentSnapshots.length,
      statistics: {
        minBalance: minBalance === Infinity ? 0 : minBalance,
        maxBalance: maxBalance === -Infinity ? 0 : maxBalance,
        totalChange,
        timeRange: hours
      }
    });
  } catch (error) {
    console.error('Snapshot fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch balance snapshots' },
      { status: 500 }
    );
  }
}

// Export the balance history for potential use in other routes
export { balanceHistory }; 