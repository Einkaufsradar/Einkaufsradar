import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nmkjxcoeeskohjceztuv.supabase.co';
const supabaseKey = 'sb_publishable_3hmXMu9L4TFsLP6jFUZv6A_7eyq034Z';

export const supabase = createClient(supabaseUrl, supabaseKey);