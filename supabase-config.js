const SUPABASE_URL = 'https://rifgnietuyhqhpxjyqwf.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_SLciH6NsVDnKTdwEBSW1zg_LVeanhF8';

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
