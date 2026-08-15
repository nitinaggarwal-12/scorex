const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = 'admin123';
  const hash = await bcrypt.hash(password, 10);
  console.log('\n🔐 Bcrypt Hash for password: "admin123"');
  console.log('Hash:', hash);
  console.log('\nUse this in your migration file.\n');
}

generateHash();


