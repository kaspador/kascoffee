import { createDirectus, rest, authentication, readMe, createUser, readItems, createItem, updateItem, deleteItem, staticToken } from '@directus/sdk';

// Authenticated Directus client for dashboard/admin operations
const directusAuth = createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://directus-production-09ff.up.railway.app')
  .with(rest())
  .with(authentication());

// Public Directus client for reading public data (user pages)
const directusPublic = createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://directus-production-09ff.up.railway.app')
  .with(rest())
  .with(authentication());

// Set the admin token for public read operations
if (process.env.DIRECTUS_TOKEN) {
  directusPublic.setToken(process.env.DIRECTUS_TOKEN);
}

// Debug token in production
console.log('DIRECTUS_TOKEN exists:', !!process.env.DIRECTUS_TOKEN);
console.log('Token length:', process.env.DIRECTUS_TOKEN?.length || 0);

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
      console.log(`DirectusAPI.getUserPage: Searching for handle "${handle}"`);
      
      const pages = await directusPublic.request(readItems('user_pages', {
        filter: { handle: { _eq: handle } }, // Use exact match to be explicit
        limit: 1
      })) as unknown[];
      
      console.log(`DirectusAPI.getUserPage: Found ${pages.length} pages for handle "${handle}"`);
      
      if (pages.length > 0) {
        const page = pages[0] as UserPage;
        console.log(`DirectusAPI.getUserPage: Page found - ID: ${page.id}, Active: ${page.is_active}, Handle: ${page.handle}`);
        return page;
      }
      
      console.log(`DirectusAPI.getUserPage: No page found for handle "${handle}"`);
      return null;
    } catch (error: unknown) {
      console.error(`DirectusAPI.getUserPage: Error fetching user page for handle "${handle}":`, error);
      return null;
    }
  },

  async getUserPageByUserId(userId: string): Promise<UserPage[]> {
    try {
      const pages = await directusAuth.request(readItems('user_pages', {
        filter: { user_id: userId } // Changed from 'user' to 'user_id'
      })) as unknown[];
      return pages as UserPage[];
    } catch (error: unknown) {
      console.error('Error fetching user pages by user ID:', error);
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
      console.log('DirectusAPI.getAllUserPages: Fetching all user pages');
      const pages = await directusPublic.request(readItems('user_pages')) as unknown[];
      console.log(`DirectusAPI.getAllUserPages: Found ${pages.length} total pages`);
      return pages as UserPage[];
    } catch (error: unknown) {
      console.error('DirectusAPI.getAllUserPages: Error fetching all user pages:', error);
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
    } catch (error: unknown) {
      console.error('Error fetching user socials (socials collection may not exist yet):', error);
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
  }
}; 