
import { supabase } from './supabaseClient';
import { MenuItem } from '../types';

export const api = {
  getMenuItems: async (): Promise<MenuItem[]> => {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching menu items:', error);
      throw new Error('Could not fetch menu items.');
    }

    return data || [];
  },
};
   