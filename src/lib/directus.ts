import { createDirectus, rest, authentication, readMe, createUser, readItems, createItem, updateItem, deleteItem } from '@directus/sdk';

// Authenticated Directus client for dashboard/admin operations
const directusAuth = createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://directus-production-09ff.up.railway.app')
  .with(rest())
  .with(authentication());

// Public Directus client for reading public data (user pages) - no auth needed for public collections
const directusPublic = createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://directus-production-09ff.up.railway.app')
  .with(rest());

export { directusAuth as directus, directusPublic };

// Type definitions for our collections
export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
  status: 'active' | 'invited' | 'draft' | 'suspended' | 'deleted';
  role?: string;
  date_created: string;
  date_updated: string;
}

export interface UserPage {
  id: string;
  user_id: string; // String type due to Directus UUID field conversion issues
  handle: string;
  display_name: string;
  short_description: string;
  long_description: string;
  kaspa_address: string;
  profile_image: string | null;
  background_image: string | null;
  background_color: string;
  foreground_color: string;
  is_active: boolean;
  view_count: number;
  date_created?: string;
  date_updated?: string;
}

export interface Social {
  id: string;
  user: string; // User ID
  platform: 'twitter' | 'discord' | 'telegram' | 'website';
  url: string;
  username?: string;
  is_visible: boolean;
  date_created: string;
  date_updated: string;
}

export interface WalletSnapshot {
  id: string;
  kaspa_address: string;
  balance: string; // Store as string to preserve precision
  balance_kas: number;
  timestamp: string; // ISO datetime
  hour_key: string; // For deduplication: "2025-07-25T20"
  date_created: string;
}

// Server-side only helper functions
export const DirectusAPI = {
  // Authentication (server-side only)
  async login(email: string, password: string) {
    const result = await directusAuth.login({ email, password });
    return result;
  },

  async logout() {
    return await directusAuth.logout();
  },

  async getCurrentUser() {
    return await directusAuth.request(readMe());
  },

  async setToken(token: string) {
    directusAuth.setToken(token);
  },

  async register(email: string, password: string, first_name?: string, last_name?: string) {
    return await directusAuth.request(createUser({
      email,
      password,
      first_name,
      last_name,
      status: 'active',
      role: 'user' // Make sure you have a 'user' role in Directus
    }));
  },

  // User Pages
  async getUserPage(handle: string): Promise<UserPage | null> {
    try {
      
      
      const pages = await directusPublic.request(readItems('user_pages', {
        filter: { handle: { _eq: handle } }, // Use exact match to be explicit
        limit: 1
      })) as unknown[];
      
      
      
      if (pages.length > 0) {
        const page = pages[0] as UserPage;
        
        return page;
      }
      
      
      return null;
          } catch {
        return null;
      }
  },

  async getUserPageByUserId(userId: string): Promise<UserPage[]> {
    try {
      const pages = await directusAuth.request(readItems('user_pages', {
        filter: { user_id: userId } // Changed from 'user' to 'user_id'
              })) as unknown[];
        return pages as UserPage[];
      } catch {
        return [];
      }
  },

  async createUserPage(data: Omit<UserPage, 'id' | 'date_created' | 'date_updated'>) {
    return await directusAuth.request(createItem('user_pages', data));
  },

  async updateUserPage(id: string, data: Partial<UserPage>) {
    return await directusAuth.request(updateItem('user_pages', id, data));
  },

  async getAllUserPages(): Promise<UserPage[]> {
    try {
      
      const pages = await directusPublic.request(readItems('user_pages')) as unknown[];
              
        return pages as UserPage[];
      } catch {
        return [];
      }
  },

  // Socials
  async getUserSocials(userId: string): Promise<Social[]> {
    try {
      const socials = await directusPublic.request(readItems('socials', {
        filter: { user: userId, is_visible: true } // Use 'user' to match the interface
      })) as unknown[];
      return socials as Social[];
          } catch {
        return []; // Return empty array if socials collection doesn't exist
      }
  },

  async createSocial(data: Omit<Social, 'id' | 'date_created' | 'date_updated'>) {
    return await directusAuth.request(createItem('socials', data));
  },

  async updateSocial(id: string, data: Partial<Social>) {
    return await directusAuth.request(updateItem('socials', id, data));
  },

  async deleteSocial(id: string) {
    return await directusAuth.request(deleteItem('socials', id));
  },

  // Wallet Snapshots
  async createWalletSnapshot(data: Omit<WalletSnapshot, 'id' | 'date_created'>) {
    return await directusPublic.request(createItem('wallet_snapshots', data));
  },

  async getWalletSnapshots(kaspaAddress: string, hours: number = 24): Promise<WalletSnapshot[]> {
    try {
      const cutoffTime = new Date(Date.now() - (hours * 60 * 60 * 1000)).toISOString();
      
      const snapshots = await directusPublic.request(readItems('wallet_snapshots', {
        filter: { 
          kaspa_address: { _eq: kaspaAddress },
          timestamp: { _gte: cutoffTime }
        },
        sort: ['-timestamp'],
        limit: hours * 2 // Allow for multiple snapshots per hour
      })) as unknown[];
      
      return snapshots as WalletSnapshot[];
    } catch {
      return [];
    }
  },

  async getLatestWalletSnapshot(kaspaAddress: string): Promise<WalletSnapshot | null> {
    try {
      const snapshots = await directusPublic.request(readItems('wallet_snapshots', {
        filter: { kaspa_address: { _eq: kaspaAddress } },
        sort: ['-timestamp'],
        limit: 1
      })) as unknown[];
      
      return snapshots.length > 0 ? snapshots[0] as WalletSnapshot : null;
    } catch {
      return null;
    }
  },

  async updateWalletSnapshot(id: string, data: Partial<WalletSnapshot>) {
    return await directusPublic.request(updateItem('wallet_snapshots', id, data));
  },

  async cleanupOldSnapshots(daysToKeep: number = 30) {
    try {
      const cutoffTime = new Date(Date.now() - (daysToKeep * 24 * 60 * 60 * 1000)).toISOString();
      
      // Get old snapshots
      const oldSnapshots = await directusPublic.request(readItems('wallet_snapshots', {
        filter: { timestamp: { _lt: cutoffTime } },
        fields: ['id']
      })) as unknown[];
      
      // Delete them
      for (const snapshot of oldSnapshots) {
        await directusPublic.request(deleteItem('wallet_snapshots', (snapshot as WalletSnapshot).id));
      }
      
      return oldSnapshots.length;
    } catch {
      return 0;
    }
  }
}; 