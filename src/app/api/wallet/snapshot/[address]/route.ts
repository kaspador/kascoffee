import { NextRequest, NextResponse } from 'next/server';
import { DirectusAPI } from '@/lib/directus';

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
    const now = new Date();
    const hour = now.toISOString().slice(0, 13); // YYYY-MM-DDTHH
    
    // Check if we already have a snapshot for this hour
    const existingSnapshots = await DirectusAPI.getWalletSnapshots(kaspaAddress, 1);
    const existingHourSnapshot = existingSnapshots.find(s => s.hour_key === hour);
    
    let snapshot;
    let balanceChange = 0;
    let changePercentage = 0;
    
    if (existingHourSnapshot) {
      // Update existing snapshot
      snapshot = await DirectusAPI.updateWalletSnapshot(existingHourSnapshot.id, {
        balance: data.balance.toString(),
        balance_kas: balanceInKas,
        timestamp: now.toISOString()
      });
    } else {
      // Create new snapshot
      snapshot = await DirectusAPI.createWalletSnapshot({
        kaspa_address: kaspaAddress,
        balance: data.balance.toString(),
        balance_kas: balanceInKas,
        timestamp: now.toISOString(),
        hour_key: hour
      });
    }
    
    // Get previous snapshot for change calculation
    const recentSnapshots = await DirectusAPI.getWalletSnapshots(kaspaAddress, 2);
    if (recentSnapshots.length > 1) {
      // Sort by timestamp to ensure proper order
      const sortedSnapshots = recentSnapshots.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      
      const currentSnapshot = sortedSnapshots[0];
      const previousSnapshot = sortedSnapshots[1];
      
      balanceChange = currentSnapshot.balance_kas - previousSnapshot.balance_kas;
      if (previousSnapshot.balance_kas > 0) {
        changePercentage = (balanceChange / previousSnapshot.balance_kas) * 100;
      }
    }
    
    // Get total snapshots count
    const allSnapshots = await DirectusAPI.getWalletSnapshots(kaspaAddress, 24 * 30); // 30 days
    
    return NextResponse.json({
      snapshot: {
        address: kaspaAddress,
        balance: data.balance,
        balanceKas: balanceInKas,
        timestamp: now.getTime(),
        hour
      },
      balanceChange,
      changePercentage,
      totalSnapshots: allSnapshots.length
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
    const snapshots = await DirectusAPI.getWalletSnapshots(kaspaAddress, hours);
    
    // Calculate statistics
    let minBalance = Infinity;
    let maxBalance = -Infinity;
    let totalChange = 0;
    
    if (snapshots.length > 0) {
      minBalance = Math.min(...snapshots.map(s => s.balance_kas));
      maxBalance = Math.max(...snapshots.map(s => s.balance_kas));
      
      if (snapshots.length > 1) {
        const sortedSnapshots = snapshots.sort((a, b) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        const firstSnapshot = sortedSnapshots[0];
        const lastSnapshot = sortedSnapshots[sortedSnapshots.length - 1];
        totalChange = lastSnapshot.balance_kas - firstSnapshot.balance_kas;
      }
    }
    
    return NextResponse.json({
      snapshots: snapshots.map(s => ({
        address: s.kaspa_address,
        balance: parseInt(s.balance),
        balanceKas: s.balance_kas,
        timestamp: new Date(s.timestamp).getTime(),
        hour: s.hour_key
      })),
      count: snapshots.length,
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