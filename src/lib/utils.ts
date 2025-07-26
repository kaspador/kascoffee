import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Kaspa price utility functions
interface KaspaPriceResponse {
  price: number;
}

let cachedPrice: number | null = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export async function getKaspaPrice(): Promise<number> {
  const now = Date.now();
  
  // Return cached price if it's still fresh
  if (cachedPrice !== null && (now - lastFetchTime) < CACHE_DURATION) {
    return cachedPrice;
  }

  try {
    const response = await fetch('https://api.kaspa.org/info/price?stringOnly=false', {
      headers: {
        'accept': 'application/json',
      },
      cache: 'no-store' // Ensure we get fresh data
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Kaspa price: ${response.status}`);
    }

    const data: KaspaPriceResponse = await response.json();
    
    // Update cache
    cachedPrice = data.price;
    lastFetchTime = now;
    
    return data.price;
  } catch {
    // Return cached price if available, otherwise fall back to a default
    if (cachedPrice !== null) {
      return cachedPrice;
    }
    
    // Fallback price (this should rarely be used)
    return 0.10;
  }
}

export function formatUSD(kasAmount: number, kasPrice: number): string {
  const usdValue = kasAmount * kasPrice;
  return usdValue.toFixed(2);
}

/**
 * Validates a Kaspa wallet address
 * FIXME: Implement proper Kaspa address validation
 * TODO: Add actual Kaspa address format validation logic
 * For now, this returns true for any non-empty string
 */
export function validateKaspaAddress(address: string): boolean {
	// Temporary implementation - always returns true for non-empty strings
	// TODO: Implement actual Kaspa address validation:
	// - Check address length (typically 61-62 characters)
	// - Check if starts with 'kaspa:' prefix
	// - Validate checksum
	// - Validate character set (base58)
	
	if (!address || address.trim().length === 0) {
		return false;
	}
	
	// Basic length check - Kaspa addresses are typically around 61-62 characters
	const trimmedAddress = address.trim();
	if (trimmedAddress.length < 30 || trimmedAddress.length > 70) {
		return false;
	}
	
	// For now, just return true for any reasonable length string
	// This needs to be properly implemented with actual Kaspa address validation
	return true;
}
