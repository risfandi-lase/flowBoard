// src/config/database.js
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Missing Supabase environment variables. Database features will not work.');
  console.log('Please add SUPABASE_URL and SUPABASE_ANON_KEY to your .env file');
}

const supabase = createClient(supabaseUrl || 'dummy', supabaseKey || 'dummy');

// Test the connection
const testConnection = async () => {
  if (!supabaseUrl || !supabaseKey) {
    console.log('Skipping database connection test - missing credentials');
    return;
  }
  
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('Database connection test failed:', error.message);
    } else {
      console.log('Database connected successfully!');
    }
  } catch (err) {
    console.log('Database connection error:', err.message);
  }
};

module.exports = { supabase, testConnection };