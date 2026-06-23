require('dotenv').config();
const supabase = require('./src/config/supabase');

async function test() {
  const yuvakNoOrMobile = '8849541876';
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id, yuvak_no, full_name, mobile')
    .or(`yuvak_no.eq.${yuvakNoOrMobile},mobile.eq.${yuvakNoOrMobile}`);

  console.log('Result:', user);
  console.log('Error:', userError);
}
test();
