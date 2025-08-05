import { NextResponse } from 'next/server';
import { DirectusAPI } from '@/lib/directus';

// In-memory cache for featured examples
interface ExampleItem {
  id: string;
  handle: string;
  title: string;
  description: string;
  category: string;
  raised: string;
  raisedNumber: number;
  supporters: number;
  tags: string[];
  color: string;
  profileImage: string | null;
  backgroundImage: string | null;
  viewCount: number;
}

interface FeaturedCache {
  examples: ExampleItem[];
  total: number;
}

let cachedFeatured: FeaturedCache | null = null;
let lastFeaturedCacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function GET() {
  try {
    // Check if we have valid cached data
    const now = Date.now();
    if (cachedFeatured && (now - lastFeaturedCacheTime) < CACHE_DURATION) {
      return NextResponse.json(cachedFeatured);
    }

    // Get all active user pages
    const allPages = await DirectusAPI.getAllUserPages();
    const activePages = allPages.filter(page => page.is_active);
    
    // Pre-filter and limit pages for better performance
    // Prioritize pages with higher view counts or existing donation goals
    const candidatePages = activePages
      .filter(page => page.view_count > 0 || page.donation_goal || page.profile_image)
      .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
      .slice(0, 8); // Reduce to 8 most promising pages
    
    // Process pages in parallel for faster execution
    const pagePromises = candidatePages.map(async (page) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/wallet/transactions/${encodeURIComponent(page.kaspa_address)}?limit=25`,
          { 
            headers: { 'accept': 'application/json' },
            cache: 'force-cache'
          }
        );
        
        let totalRaised = 0;
        let supporterCount = 0;
        
        if (response.ok) {
          const data = await response.json();
          const donations = data.transactions || [];
          
          totalRaised = donations.reduce((sum: number, tx: { amountKas?: number }) => sum + (tx.amountKas || 0), 0);
          supporterCount = donations.length;
        }
        
        // Include page if it has donations, views, or looks interesting
        if (totalRaised > 0 || page.view_count > 5 || page.profile_image) {
          return {
            id: page.id,
            handle: page.handle,
            title: page.display_name,
            description: page.short_description,
            category: determineCategory(page.display_name, page.short_description),
            raised: `${Math.floor(totalRaised).toLocaleString()} KAS`,
            raisedNumber: Math.floor(totalRaised),
            supporters: supporterCount,
            tags: generateTags(page.display_name, page.short_description),
            color: generateGradientColor(page.handle),
            profileImage: page.profile_image,
            backgroundImage: page.background_image,
            viewCount: page.view_count
          };
        }
        return null;
      } catch {
        return null;
      }
    });

    // Wait for all pages to be processed in parallel
    const pageResults = await Promise.all(pagePromises);
    const pagesWithStats = pageResults.filter(page => page !== null);
    
    // Sort by total raised (descending) and take top 6 for featured
    const featuredPages = pagesWithStats
      .sort((a, b) => b.raisedNumber - a.raisedNumber)
      .slice(0, 6);

    const result = {
      examples: featuredPages,
      total: pagesWithStats.length
    };

    // Cache the results
    cachedFeatured = result;
    lastFeaturedCacheTime = now;
    
    return NextResponse.json(result);
    
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch featured examples' },
      { status: 500 }
    );
  }
}

function determineCategory(displayName: string, description: string): string {
  const text = `${displayName} ${description}`.toLowerCase();
  
  if (text.includes('developer') || text.includes('code') || text.includes('open source') || text.includes('github')) {
    return 'Developer';
  }
  if (text.includes('artist') || text.includes('art') || text.includes('creative') || text.includes('design')) {
    return 'Art';
  }
  if (text.includes('game') || text.includes('stream') || text.includes('gaming') || text.includes('twitch')) {
    return 'Gaming';
  }
  if (text.includes('podcast') || text.includes('audio') || text.includes('media') || text.includes('content')) {
    return 'Media';
  }
  if (text.includes('charity') || text.includes('nonprofit') || text.includes('cause') || text.includes('help')) {
    return 'Nonprofit';
  }
  
  return 'Creator';
}

function generateTags(displayName: string, description: string): string[] {
  const text = `${displayName} ${description}`.toLowerCase();
  const tags = [];
  
  if (text.includes('creative') || text.includes('art')) tags.push('Creative');
  if (text.includes('tech') || text.includes('code')) tags.push('Technical');
  if (text.includes('community')) tags.push('Community');
  if (text.includes('modern')) tags.push('Modern');
  if (text.includes('portfolio')) tags.push('Portfolio');
  if (text.includes('project')) tags.push('Project');
  if (text.includes('open source')) tags.push('Open Source');
  if (text.includes('stream')) tags.push('Streaming');
  if (text.includes('interactive')) tags.push('Interactive');
  if (text.includes('podcast')) tags.push('Podcast');
  
  // Add some default tags if none were found
  if (tags.length === 0) {
    tags.push('Popular', 'Featured');
  }
  
  return tags.slice(0, 3); // Limit to 3 tags
}

function generateGradientColor(handle: string): string {
  // Generate consistent gradient colors based on handle
  const colors = [
    'from-[#70C7BA] to-[#49EACB]',
    'from-[#49EACB] to-[#70C7BA]',
    'from-[#70C7BA] to-[#5ba8a0]',
    'from-[#3dd4b4] to-[#49EACB]'
  ];
  
  // Use handle to determine color consistently
  const index = handle.length % colors.length;
  return colors[index];
}