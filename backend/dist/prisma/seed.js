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
const tenantsToSeed = [
    {
        subdomain: 'pho-houston',
        tenantName: 'Pho Houston Corporation',
        restaurantName: 'Pho Houston',
        menus: [
            { name: 'Noodles - Special Combination Noodles', price: 15.5 },
            { name: 'Noodles - Free-range Chicken Noodles', price: 13.95 },
            { name: 'Rolls - Fresh Spring Rolls', price: 8.5 },
            { name: 'Rolls - Crispy Egg Rolls', price: 7 },
            { name: 'Beverages - Vietnamese Iced Milk Coffee', price: 5.5 },
            { name: 'Beverages - Peach Orange Lemongrass Tea', price: 4.95 },
        ],
    },
    {
        subdomain: 'cafeviet',
        tenantName: 'Cafe Viet LLC',
        restaurantName: 'Cafe Viet',
        menus: [
            { name: 'Sandwich - Vietnamese Pork Roll Bread', price: 9.5 },
            { name: 'Noodles - Spicy Beef Hue Noodles', price: 14.25 },
            { name: 'Rice - Grilled Chicken Rice Plate', price: 12.5 },
            { name: 'Rolls - Shrimp and Pork Fresh Rolls', price: 7.25 },
            { name: 'Beverages - Vietnamese Iced Coffee', price: 5.25 },
            { name: 'Beverages - Peach Orange Lemongrass Tea', price: 4.95 },
        ],
    },
    {
        subdomain: 'banh-my-saigon',
        tenantName: 'Banh My Saigon Inc',
        restaurantName: 'Banh My Saigon',
        menus: [
            { name: 'Sandwich - Saigon Special Bread', price: 10.25 },
            { name: 'Sandwich - Grilled Pork Bread', price: 10.75 },
            { name: 'Sandwich - Grilled Chicken Bread', price: 9.95 },
            { name: 'Sandwich - Sunny Side Egg Bread', price: 9.25 },
            { name: 'Beverages - Coconut Coffee', price: 5.75 },
            { name: 'Beverages - Jasmine Milk Tea', price: 5.15 },
        ],
    },
    {
        subdomain: 'com-tam-cali',
        tenantName: 'Com Tam Cali Group',
        restaurantName: 'Com Tam Cali',
        menus: [
            { name: 'Rice - Broken Rice with Grilled Pork Chop', price: 13.5 },
            { name: 'Rice - Broken Rice with Shredded Pork and Egg Meatloaf', price: 12.95 },
            { name: 'Rice - Broken Rice with Roasted Chicken', price: 12.5 },
            { name: 'Noodles - Grilled Pork Vermicelli Bowl', price: 13.25 },
            { name: 'Beverages - Salted Plum Soda', price: 4.95 },
            { name: 'Beverages - Passion Fruit Tea', price: 4.75 },
        ],
    },
];
async function seedTenantData(seedTenant) {
    const tenant = await prisma.tenant.upsert({
        where: { subdomain: seedTenant.subdomain },
        update: { name: seedTenant.tenantName },
        create: {
            name: seedTenant.tenantName,
            subdomain: seedTenant.subdomain,
        },
    });
    let restaurant = await prisma.restaurant.findFirst({
        where: { tenantId: tenant.id, name: seedTenant.restaurantName },
    });
    if (!restaurant) {
        restaurant = await prisma.restaurant.create({
            data: {
                name: seedTenant.restaurantName,
                tenantId: tenant.id,
            },
        });
    }
    await prisma.menu.deleteMany({
        where: { tenantId: tenant.id, restaurantId: restaurant.id },
    });
    await prisma.menu.createMany({
        data: seedTenant.menus.map((menu) => ({
            name: menu.name,
            price: menu.price,
            tenantId: tenant.id,
            restaurantId: restaurant.id,
        })),
    });
}
async function main() {
    console.log('--- Start seeding DeliFood tenant data ---');
    for (const seedTenant of tenantsToSeed) {
        await seedTenantData(seedTenant);
    }
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