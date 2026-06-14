require('dotenv').config();
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);

  const associates = await prisma.deliveryAssociate.findMany();
  console.log(`Creating login credentials for ${associates.length} delivery associates...\n`);

  for (const da of associates) {
    // Skip if already has login
    if (da.loginId) {
      console.log(`  ⏭️  ${da.name} already has login`);
      continue;
    }

    const loginId = `login-da-${da.id.slice(0, 8)}`;

    // Create login credentials
    await prisma.loginCredentials.create({
      data: {
        id: loginId,
        email: da.email,
        passwordHash,
        role: 'DELIVERY_PARTNER',
      },
    });

    // Link to delivery associate
    await prisma.deliveryAssociate.update({
      where: { id: da.id },
      data: { loginId },
    });

    console.log(`  ✅ ${da.name} (${da.email}) → role: DELIVERY_PARTNER`);
  }

  console.log('\n✅ All delivery associates can now login with password: password123');
  await prisma.$disconnect();
}

main().catch(e => { console.error('Error:', e.message); process.exit(1); });
