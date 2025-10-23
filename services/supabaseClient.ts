
import { createClient } from '@supabase/supabase-js';

// These should ideally be in a .env file, but for this environment, we'll define them here.
const supabaseUrl = 'https://fznwowvfkskxzqwxsorm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6bndvd3Zma3NreHpxd3hzb3JtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExMDgyNjQsImV4cCI6MjA3NjY4NDI2NH0.YKhDwZAsCGFrIJYcYXkym9b8NgLlSq7hPUo6x4kPi9E';

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL and Anon Key must be provided.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
   