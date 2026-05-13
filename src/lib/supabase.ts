import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tbecimjtjltrlleatnjo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiZWNpbWp0amx0cmxsZWF0bmpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NTkwNjUsImV4cCI6MjA5NDIzNTA2NX0.nqib1uKT6OHV0iEoYjpbnW5bSd0EKO5UWfMC-jPlM5E';

export const supabase = createClient(supabaseUrl, supabaseKey);
