// @ts-ignore
import { createClient } from '@supabase/supabase-js';

// Supabase project credentials
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://fkssqahgjatvpiinadnd.supabase.co';
const supabasePublishableKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_YFq4IQT8l1D2wAUZ7tgBTQ_dilYA7KO';

export const supabase = createClient(supabaseUrl, supabasePublishableKey);
