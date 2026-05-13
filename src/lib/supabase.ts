import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tbecimjtjtrilseatnjo.supabase.co';
const supabaseKey = 'sb_publishable_OLA5PJO-cg43j2g0I7i0zw_xl_EqUyL';

export const supabase = createClient(supabaseUrl, supabaseKey);
