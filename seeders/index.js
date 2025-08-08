const seedUsers = require('./userSeeder');
const seedMaterials = require('./materialSeeder');
const connectDB = require('../config/mongo');

const seedDatabase = async () => {
    await connectDB();
    console.log('Seeding database...');
    await seedUsers();
    await seedMaterials();
    console.log('Database seeding completed');
};

seedDatabase();

// module.exports = seedDatabase;
