"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const adapter_pg_1 = require("@prisma/adapter-pg");
const client_1 = require("@prisma/client");
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error('DATABASE_URL is required to seed the database');
}
const prisma = new client_1.PrismaClient({
    adapter: new adapter_pg_1.PrismaPg({ connectionString }),
});
async function main() {
    console.log('--- Start seeding Pho Houston data ---');
    const tenant = await prisma.tenant.upsert({
        where: { subdomain: 'pho-houston' },
        update: {},
        create: {
            name: 'Pho Houston Corporation',
            subdomain: 'pho-houston',
        },
    });
    let restaurant = await prisma.restaurant.findFirst({
        where: { tenantId: tenant.id, name: 'Pho Houston' },
    });
    if (!restaurant) {
        restaurant = await prisma.restaurant.create({
            data: {
                name: 'Pho Houston',
                tenantId: tenant.id,
            },
        });
    }
    await prisma.menu.deleteMany({
        where: { tenantId: tenant.id, restaurantId: restaurant.id },
    });
    await prisma.menu.createMany({
        data: [
            {
                name: 'Special Combination Pho',
                price: 15.5,
                tenantId: tenant.id,
                restaurantId: restaurant.id,
            },
            {
                name: 'Free-range Chicken Pho',
                price: 13.95,
                tenantId: tenant.id,
                restaurantId: restaurant.id,
            },
            {
                name: 'Fresh Spring Rolls',
                price: 8.5,
                tenantId: tenant.id,
                restaurantId: restaurant.id,
            },
            {
                name: 'Crispy Egg Rolls',
                price: 7,
                tenantId: tenant.id,
                restaurantId: restaurant.id,
            },
            {
                name: 'Vietnamese Iced Milk Coffee',
                price: 5.5,
                tenantId: tenant.id,
                restaurantId: restaurant.id,
            },
            {
                name: 'Peach Orange Lemongrass Tea',
                price: 4.95,
                tenantId: tenant.id,
                restaurantId: restaurant.id,
            },
        ],
    });
    console.log('--- Seeding completed successfully ---');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map