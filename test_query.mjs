import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://nvtzsxuejwlgnayescfw.supabase.co';
const SUPABASE_KEY = 'sb_publishable__8p5SlJyL9kzsfV4BUbV0Q_BuQx2wwR';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function test() {
    const { data, error } = await supabase
      .from('popup_ad_schedules')
      .select('id, listings(id, profiles(name))')
      .limit(1);
    
    console.log('Data:', data);
    console.log('Error:', JSON.stringify(error, null, 2));
}

test();
