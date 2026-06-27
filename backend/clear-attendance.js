require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_KEY in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function clearAttendance() {
  console.log('⏳ Clearing attendance_log table...');
  try {
    // In Supabase, you need a filter to delete all rows unless configured otherwise.
    // .neq('id', '00000000-0000-0000-0000-000000000000') safely matches all valid UUIDs.
    const { data, error } = await supabase
      .from('attendance_log')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (error) {
      throw error;
    }
    
    console.log('✅ Successfully cleared all records from the attendance_log table!');
    console.log('You can now scan and mark attendance again with the same number.');
  } catch (err) {
    console.error('❌ Error clearing attendance table:', err.message);
  }
}

clearAttendance();
