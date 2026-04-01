import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const missingSupabaseEnv = !supabaseUrl || !supabaseAnonKey

if (missingSupabaseEnv) {
	// Surface misconfiguration early so UI can show a helpful error instead of failing silently.
	console.error('Supabase env vars missing: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')
