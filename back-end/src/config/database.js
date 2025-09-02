// src/config/database.js
const { createClient } = require('@supabase/supabase-js');

let supabase = null;

const getSupabase = () => {
  if (supabase) {
    return supabase;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.warn('Missing Supabase environment variables. Database features will not work.');
    console.log('Please add SUPABASE_URL and SUPABASE_ANON_KEY to your .env file');
    // Return a dummy client to avoid crashes, but functionality will be broken.
    return createClient('dummy', 'dummy');
  }

  supabase = createClient(supabaseUrl, supabaseKey);
  console.log('Supabase client initialized.');
  return supabase;
};

// This function is no longer called during startup but can be used for a diagnostic endpoint.
const testConnection = async () => {
  const db = getSupabase();
  if (db.supabaseUrl === 'dummy') {
     console.log('Skipping database connection test - missing credentials');
    return;
  }
  
  try {
    const { error } = await db.from('users').select('id').limit(1);
    if (error) {
      console.error('Database connection test failed:', error.message);
    } else {
      console.log('Database connected successfully!');
    }
  } catch (err) {
    console.error('Database connection error:', err.message);
  }
};

module.exports = { getSupabase, testConnection };