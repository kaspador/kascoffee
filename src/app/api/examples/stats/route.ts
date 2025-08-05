import { NextResponse } from 'next/server';
import { DirectusAPI } from '@/lib/directus';

// In-memory cache for stats (production should use Redis or similar)
interface StatsCache {
  totalRaised: number;
  activePages: number;
  supporters: number;
  uptime: number;
}

let cachedStats: StatsCache | null = null;
let lastCacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function GET() {
  try {
    // Check if we have valid cached data
    const now = Date.now();
    if (cachedStats && (now - lastCacheTime) < CACHE_DURATION) {
      return NextResponse.json(cachedStats);
    }

    // Get all active user pages
    const allPages = await DirectusAPI.getAllUserPages();
    const activePages = allPages.filter(page => page.is_active);
    
    // For faster response, process only a sample of pages for stats calculation
    // Take top pages by view count (most popular pages likely have more donations)
    const samplePages = activePages
      .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
      .slice(0, 20); // Limit to 20 most popular pages for stats calculation
    
    // Calculate total raised and supporters from sample pages
    let totalRaised = 0;
    let totalSupporters = 0;
    
    // Process pages in parallel with Promise.all for faster execution
    const donationPromises = samplePages.map(async (page) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/wallet/transactions/${encodeURIComponent(page.kaspa_address)}?limit=50`,
          { 
            headers: { 'accept': 'application/json' },
            cache: 'force-cache'
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          const donations = data.transactions || [];
          
          const pageTotalKas = donations.reduce((sum: number, tx: { amountKas?: number }) => sum + (tx.amountKas || 0), 0);
          return {
            raised: pageTotalKas,
            supporters: donations.length
          };
        }
        return { raised: 0, supporters: 0 };
      } catch {
        return { raised: 0, supporters: 0 };
      }
    });

    // Wait for all donation data to be fetched in parallel
    const donationResults = await Promise.all(donationPromises);
    
    // Sum up results
    totalRaised = donationResults.reduce((sum, result) => sum + result.raised, 0);
    totalSupporters = donationResults.reduce((sum, result) => sum + result.supporters, 0);
    
    // Estimate total based on sample (extrapolate from sample to full dataset)
    const estimationMultiplier = activePages.length / samplePages.length;
    const estimatedTotalRaised = Math.floor(totalRaised * estimationMultiplier);
    const estimatedTotalSupporters = Math.floor(totalSupporters * estimationMultiplier);

    const stats = {
      totalRaised: estimatedTotalRaised,
      activePages: activePages.length,
      supporters: estimatedTotalSupporters,
      uptime: 99.9
    };

    // Cache the results
    cachedStats = stats;
    lastCacheTime = now;
    
    return NextResponse.json(stats);
    
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}