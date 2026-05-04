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
            { name: 'Special Combination Pho', price: 15.5 },
            { name: 'Free-range Chicken Pho', price: 13.95 },
            { name: 'Fresh Spring Rolls', price: 8.5 },
            { name: 'Crispy Egg Rolls', price: 7 },
            { name: 'Vietnamese Iced Milk Coffee', price: 5.5 },
            { name: 'Peach Orange Lemongrass Tea', price: 4.95 },
        ],
    },
    {
        subdomain: 'cafeviet',
        tenantName: 'Cafe Viet LLC',
        restaurantName: 'Cafe Viet',
        menus: [
            { name: 'Banh Mi Cha Lua', price: 9.5 },
            { name: 'Bun Bo Hue', price: 14.25 },
            { name: 'Com Ga Nuong', price: 12.5 },
            { name: 'Goi Cuon Tom Thit', price: 7.25 },
            { name: 'Ca Phe Sua Da', price: 5.25 },
            { name: 'Tra Dao Cam Sa', price: 4.95 },
        ],
    },
    {
        subdomain: 'banh-my-saigon',
        tenantName: 'Banh My Saigon Inc',
        restaurantName: 'Banh My Saigon',
        menus: [
            { name: 'Banh Mi Dac Biet', price: 10.25 },
            { name: 'Banh Mi Thit Nuong', price: 10.75 },
            { name: 'Banh Mi Ga Nuong', price: 9.95 },
            { name: 'Banh Mi Op La', price: 9.25 },
            { name: 'Coconut Coffee', price: 5.75 },
            { name: 'Jasmine Milk Tea', price: 5.15 },
        ],
    },
    {
        subdomain: 'com-tam-cali',
        tenantName: 'Com Tam Cali Group',
        restaurantName: 'Com Tam Cali',
        menus: [
            { name: 'Com Tam Suon Nuong', price: 13.5 },
            { name: 'Com Tam Bi Cha', price: 12.95 },
            { name: 'Com Tam Ga Roti', price: 12.5 },
            { name: 'Bun Thit Nuong', price: 13.25 },
            { name: 'Salted Plum Soda', price: 4.95 },
            { name: 'Passion Fruit Tea', price: 4.75 },
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