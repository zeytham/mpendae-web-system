require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const prisma = new PrismaClient();

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((resolve) => rl.question(q, resolve));

async function main() {
  console.log('=== Kuunda Admin wa Kwanza (Superadmin) ===\n');

  const email = await ask('Barua pepe ya admin: ');
  const name = await ask('Jina la admin: ');
  const password = await ask('Password (angalau herufi 8): ');

  if (!email || !name || password.length < 8) {
    console.error('\n❌ Taarifa hazitoshi. Password lazima iwe angalau herufi 8.');
    rl.close();
    process.exit(1);
  }

  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
  if (existing) {
    console.error('\n❌ Barua pepe hii tayari ipo kwenye database.');
    rl.close();
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const admin = await prisma.user.create({
    data: {
      email: email.toLowerCase().trim(),
      name: name.trim(),
      password: hashedPassword,
      role: 'superadmin',
    },
  });

  console.log(`\n✅ Superadmin ameundwa: ${admin.email} (role: ${admin.role})`);
  console.log('Sasa unaweza login kwenye /login na barua pepe na password uliyoweka.');

  rl.close();
  process.exit(0);
}

main().catch((err) => {
  console.error('Error:', err.message);
  rl.close();
  process.exit(1);
});