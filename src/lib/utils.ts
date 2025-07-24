import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
