const bcrypt = require('bcryptjs');

const hash = '$2b$10$JzEjiEnD647bYmMnPL3LmO/T8FfuFMVk8PJHJVMeyz3u51Mr4dkY2';
const passwordsToTest = ['8849541876', 'sarsa123', 'baps123', 'yuvak1234', 'password123'];

async function test() {
  for (const pwd of passwordsToTest) {
    const isMatch = await bcrypt.compare(pwd, hash);
    if (isMatch) {
      console.log('Match found:', pwd);
      return;
    }
  }
  console.log('No match found.');
}
test();
