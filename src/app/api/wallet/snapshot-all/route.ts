import { NextResponse } from 'next/server';
import { DirectusAPI } from '@/lib/directus';

export async function POST() {
  try {
    // Get all active user pages with Kaspa addresses
    const userPages = await DirectusAPI.getAllUserPages();
    
    if (!userPages || userPages.length === 0) {
      return NextResponse.json({
        message: 'No user pages found',
        snapshotsTaken: 0
      });
    }

    const results = [];
    let successCount = 0;
    let errorCount = 0;

    // Take snapshots for each active wallet
    for (const userPage of userPages) {
      if (!userPage.kaspa_address || !userPage.is_active) {
        continue;
      }

      try {
        // Call our snapshot API for this address
        const snapshotResponse = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/wallet/snapshot/${encodeURIComponent(userPage.kaspa_address)}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (snapshotResponse.ok) {
          const snapshotData = await snapshotResponse.json();
          results.push({
            handle: userPage.handle,
            address: userPage.kaspa_address,
            success: true,
            balance: snapshotData.snapshot?.balanceKas || 0,
            change: snapshotData.balanceChange || 0
          });
          successCount++;
        } else {
          throw new Error(`Snapshot failed with status ${snapshotResponse.status}`);
        }
      } catch (error) {
        results.push({
          handle: userPage.handle,
          address: userPage.kaspa_address,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        errorCount++;
      }

      // Add a small delay to avoid overwhelming the Kaspa API
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return NextResponse.json({
      message: `Snapshot process completed`,
      totalProcessed: results.length,
      successCount,
      errorCount,
      timestamp: new Date().toISOString(),
      results: results.slice(0, 20) // Limit results to avoid large responses
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to process snapshots' },
      { status: 500 }
    );
  }
}

// Also allow GET for health checks
export async function GET() {
  return NextResponse.json({
    service: 'Wallet Snapshot Service',
    status: 'healthy',
    description: 'Takes balance snapshots for all active wallets'
  });
} 