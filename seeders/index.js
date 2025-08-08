const seedUsers = require("./userSeeder");
const seedMaterials = require("./materialSeeder");
const seedComplaints = require("./complaintSeeder");
const connectDB = require("../config/mongo");

const seedDatabase = async () => {
  await connectDB();
  console.log("Seeding database...");
  await seedUsers();
  await seedMaterials();
  await seedComplaints();
  console.log("Database seeding completed");
  process.exit(0);
};

seedDatabase();

// module.exports = seedDatabase;
