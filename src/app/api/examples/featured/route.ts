import { NextResponse } from 'next/server';
import { DirectusAPI } from '@/lib/directus';

export async function GET() {
  try {
    // Get all active user pages
    const allPages = await DirectusAPI.getAllUserPages();
    const activePages = allPages.filter(page => page.is_active);
    
    // Process pages to get donation data and create featured examples
    const pagesWithStats = [];
    
    for (const page of activePages.slice(0, 12)) { // Limit to 12 pages for performance
      try {
        // Get transactions for this page's Kaspa address
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/wallet/transactions/${encodeURIComponent(page.kaspa_address)}?limit=50`,
          { 
            headers: { 'accept': 'application/json' },
            next: { revalidate: 300 } // Cache for 5 minutes
          }
        );
        
        let totalRaised = 0;
        let supporterCount = 0;
        
        if (response.ok) {
          const data = await response.json();
          const donations = data.transactions || [];
          
          // Sum up all donations
          totalRaised = donations.reduce((sum: number, tx: { amountKas?: number }) => sum + (tx.amountKas || 0), 0);
          supporterCount = donations.length;
        }
        
        // Only include pages with actual donations or interesting profiles
        if (totalRaised > 0 || page.view_count > 10) {
          pagesWithStats.push({
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
          });
        }
      } catch {
        // Continue with other pages
      }
    }
    
    // Sort by total raised (descending) and take top 6 for featured
    const featuredPages = pagesWithStats
      .sort((a, b) => b.raisedNumber - a.raisedNumber)
      .slice(0, 6);
    
    return NextResponse.json({
      examples: featuredPages,
      total: pagesWithStats.length
    });
    
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