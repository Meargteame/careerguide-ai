
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase Environment Variables');
}

// Check for placeholder/invalid URL patterns
if (supabaseUrl?.includes('zksgxdjrjvbpjzjvneux')) {
  console.error('CRITICAL: You are using a dead Supabase project URL. Please update frontend/.env with your own Supabase credentials.');
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);
