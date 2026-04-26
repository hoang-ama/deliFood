import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.tenant.upsert({
    where: { subdomain: 'default' },
    update: {},
    create: {
      name: 'Default Tenant',
      subdomain: 'default',
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
