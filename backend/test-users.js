require('dotenv').config();
const supabase = require('./src/config/supabase');
async function test() {
  const { data } = await supabase.from('users').select('*');
  console.log(data);
}
test();
