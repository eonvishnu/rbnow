import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xsdkpbvvbjzvchlsdizi.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_9l2rycX2witb2v5UY-UNAA_mj6qT6Dn';

export const supabase = createClient(supabaseUrl, supabaseKey);
