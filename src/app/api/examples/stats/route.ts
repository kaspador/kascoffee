import { NextResponse } from 'next/server';
import { DirectusAPI } from '@/lib/directus';

export async function GET() {
  try {
    // Get all active user pages
    const allPages = await DirectusAPI.getAllUserPages();
    const activePages = allPages.filter(page => page.is_active);
    
    // Calculate total raised and supporters from all active pages
    let totalRaised = 0;
    let totalSupporters = 0;
    
    // Process each active page to get donations
    for (const page of activePages) {
      try {
        // Get transactions for this page's Kaspa address
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/wallet/transactions/${encodeURIComponent(page.kaspa_address)}?limit=100`,
          { 
            headers: { 'accept': 'application/json' },
            next: { revalidate: 300 } // Cache for 5 minutes
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          const donations = data.transactions || [];
          
          // Sum up all donations for this page
          const pageTotalKas = donations.reduce((sum: number, tx: any) => sum + (tx.amountKas || 0), 0);
          totalRaised += pageTotalKas;
          
          // Count unique supporters (transactions) for this page
          totalSupporters += donations.length;
        }
      } catch (error) {
        // Continue processing other pages even if one fails
      }
    }
    
    return NextResponse.json({
      totalRaised: Math.floor(totalRaised),
      activePages: activePages.length,
      supporters: totalSupporters,
      uptime: 99.9 // Static for now, could be calculated from monitoring
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}