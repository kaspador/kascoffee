import 'server-only';

import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';

// Create a window object for server-side DOMPurify
const window = new JSDOM('').window;
const purify = DOMPurify(window);

/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param dirty - The HTML content to sanitize
 * @returns Sanitized HTML string
 */
export function sanitizeHtml(dirty: string): string {
	return purify.sanitize(dirty, {
		ALLOWED_TAGS: [
			'p', 'br', 'strong', 'em', 'u', 's', 'blockquote', 'code', 'pre',
			'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
			'ul', 'ol', 'li',
			'a'
		],
		ALLOWED_ATTR: ['href', 'target', 'rel'],
		ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
		FORBID_TAGS: ['script', 'object', 'embed', 'base'],
		FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover']
	});
}

/**
 * Strips all HTML tags from content, leaving only text
 * @param html - The HTML content to strip
 * @returns Plain text string
 */
export function stripHtml(html: string): string {
	return purify.sanitize(html, { ALLOWED_TAGS: [] });
} 