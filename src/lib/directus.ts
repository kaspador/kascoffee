import { createDirectus, rest, authentication, readMe, createUser, readItems, createItem, updateItem, deleteItem } from '@directus/sdk';

// Directus client configuration
const directus = createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://directus-production-09ff.up.railway.app')
  .with(rest())
  .with(authentication());

export { directus };

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
  user: string; // User ID
  handle: string;
  display_name: string;
  short_description?: string;
  long_description?: string;
  kaspa_address?: string;
  profile_image?: string;
  background_image?: string;
  background_color: string;
  foreground_color: string;
  is_active: boolean;
  view_count: number;
  date_created: string;
  date_updated: string;
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

// Helper functions for common operations
export const DirectusAPI = {
  // Authentication
  async login(email: string, password: string) {
    const result = await directus.login({ email, password });
    // Store auth in localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('directus_auth_token', JSON.stringify(result));
    }
    return result;
  },

  async logout() {
    const result = await directus.logout();
    // Clear auth from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('directus_auth_token');
    }
    return result;
  },

  async getCurrentUser() {
    try {
      // Check if we have stored auth token
      if (typeof window !== 'undefined') {
        const storedToken = localStorage.getItem('directus_auth_token');
        if (storedToken) {
          const tokenData = JSON.parse(storedToken);
          if (tokenData.access_token) {
            // Set the token for current request
            directus.setToken(tokenData.access_token);
          }
        }
      }
      return await directus.request(readMe());
    } catch (error) {
      console.error('Error getting current user:', error);
      // Clear invalid token
      if (typeof window !== 'undefined') {
        localStorage.removeItem('directus_auth_token');
      }
      throw error;
    }
  },

  async isAuthenticated(): Promise<boolean> {
    try {
      await this.getCurrentUser();
      return true;
    } catch {
      return false;
    }
  },

  async register(email: string, password: string, first_name?: string, last_name?: string) {
    return await directus.request(createUser({
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
      const pages = await directus.request(readItems('user_pages', {
        filter: { handle },
        limit: 1
      })) as unknown[];
      return (pages[0] as UserPage) || null;
    } catch (error: unknown) {
      console.error('Error fetching user page:', error);
      return null;
    }
  },

  async getUserPageByUserId(userId: string): Promise<UserPage[]> {
    try {
      const pages = await directus.request(readItems('user_pages', {
        filter: { user: userId }
      })) as unknown[];
      return pages as UserPage[];
    } catch (error: unknown) {
      console.error('Error fetching user pages by user ID:', error);
      return [];
    }
  },

  async createUserPage(data: Omit<UserPage, 'id' | 'date_created' | 'date_updated'>) {
    return await directus.request(createItem('user_pages', data));
  },

  async updateUserPage(id: string, data: Partial<UserPage>) {
    return await directus.request(updateItem('user_pages', id, data));
  },

  // Socials
  async getUserSocials(userId: string): Promise<Social[]> {
    try {
      const socials = await directus.request(readItems('socials', {
        filter: { user: userId, is_visible: true }
      })) as unknown[];
      return socials as Social[];
    } catch (error: unknown) {
      console.error('Error fetching user socials:', error);
      return [];
    }
  },

  async createSocial(data: Omit<Social, 'id' | 'date_created' | 'date_updated'>) {
    return await directus.request(createItem('socials', data));
  },

  async updateSocial(id: string, data: Partial<Social>) {
    return await directus.request(updateItem('socials', id, data));
  },

  async deleteSocial(id: string) {
    return await directus.request(deleteItem('socials', id));
  }
}; 