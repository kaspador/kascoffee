import { NextRequest, NextResponse } from 'next/server';
import { DirectusAPI } from '@/lib/directus';

export async function GET(_request: NextRequest) {
  try {
    // Test admin token setup
    if (!process.env.DIRECTUS_TOKEN) {
      return NextResponse.json({
        error: 'DIRECTUS_TOKEN not configured',
        step: 'token_check'
      }, { status: 500 });
    }

    // Set admin token
    await DirectusAPI.setToken(process.env.DIRECTUS_TOKEN);

    // Test a simple Directus operation
    const testAddress = 'kaspa:qzuyf00lrj6tf2p8cm9n4g5md36qknvvq3h0psvf4p7wuezmcjp67ljcm6zlx';
    
    // Test getWalletSnapshots function
    const snapshots = await DirectusAPI.getWalletSnapshots(testAddress, 1);
    
    return NextResponse.json({
      success: true,
      tokenConfigured: true,
      snapshotsCount: snapshots.length,
      directusConnection: 'working'
    });

  } catch (error) {
    return NextResponse.json({
      error: 'Debug test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
} 