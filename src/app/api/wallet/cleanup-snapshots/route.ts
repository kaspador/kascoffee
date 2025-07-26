import { NextRequest, NextResponse } from 'next/server';
import { DirectusAPI } from '@/lib/directus';

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const daysToKeep = parseInt(searchParams.get('days') || '30');
    
    if (daysToKeep < 1 || daysToKeep > 365) {
      return NextResponse.json(
        { error: 'Days to keep must be between 1 and 365' },
        { status: 400 }
      );
    }

    const deletedCount = await DirectusAPI.cleanupOldSnapshots(daysToKeep);
    
    return NextResponse.json({
      success: true,
      message: `Cleanup completed`,
      deletedSnapshots: deletedCount,
      daysKept: daysToKeep,
      timestamp: new Date().toISOString()
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to cleanup old snapshots' },
      { status: 500 }
    );
  }
}

// Also allow GET for health checks
export async function GET() {
  return NextResponse.json({
    service: 'Wallet Snapshot Cleanup Service',
    status: 'healthy',
    description: 'Removes old wallet snapshots from database',
    defaultRetention: '30 days'
  });
} 