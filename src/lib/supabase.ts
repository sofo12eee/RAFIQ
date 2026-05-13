import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tbecimjtjtrilseatnjo.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || 'sb_publishable_OLA5PJO-cg43j2g0I7i0zw_xl_EqUyL';

export const supabase = createClient(supabaseUrl, supabaseKey);
