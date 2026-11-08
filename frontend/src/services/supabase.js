import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl.includes('http'));

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Mock user session for demo / offline preview
const DEMO_USER = {
  id: 'b103-david-kick',
  email: 'david@sportsplatform.com',
  user_metadata: {
    username: 'david_kick',
    full_name: 'David Silva',
    primary_sport: 'Football',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
  }
};

export const authService = {
  async getCurrentUser() {
    if (supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) return user;
      } catch (err) {
        console.warn('Supabase auth warning:', err);
      }
    }
    const saved = localStorage.getItem('sports_auth_user');
    return saved ? JSON.parse(saved) : DEMO_USER;
  },

  async login(email, password) {
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      localStorage.setItem('sports_auth_user', JSON.stringify(data.user));
      return data.user;
    }
    // Demo fallback login
    const user = { ...DEMO_USER, email };
    localStorage.setItem('sports_auth_user', JSON.stringify(user));
    return user;
  },

  async register(email, password, metadata) {
    if (supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: metadata }
      });
      if (error) throw error;
      localStorage.setItem('sports_auth_user', JSON.stringify(data.user));
      return data.user;
    }
    // Demo fallback register
    const user = {
      id: `usr-${Date.now()}`,
      email,
      user_metadata: {
        username: metadata.username || email.split('@')[0],
        full_name: metadata.full_name || 'New Athlete',
        primary_sport: metadata.primary_sport || 'Football',
        avatar_url: metadata.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
      }
    };
    localStorage.setItem('sports_auth_user', JSON.stringify(user));
    return user;
  },

  async logout() {
    if (supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('sports_auth_user');
  },

  async uploadStorageMedia(bucketName, file) {
    if (supabase) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { data, error } = await supabase.storage
        .from(bucketName || 'sports-media')
        .upload(filePath, file);

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from(bucketName || 'sports-media')
        .getPublicUrl(filePath);

      return publicUrlData.publicUrl;
    }
    // Demo local object URL
    return URL.createObjectURL(file);
  }
};
