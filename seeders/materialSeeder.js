const Material = require("../models/Material");

// Function to generate 1–5 random batches
const getRandomBatches = () => {
  const batchCount = Math.floor(Math.random() * 5) + 1; // 1–5 batches
  const batches = [];

  for (let i = 0; i < batchCount; i++) {
    batches.push({
      quantity: Math.floor(Math.random() * 451) + 50, // Quantity: 50–500
      unitPrice: parseFloat((Math.random() * 490 + 10).toFixed(2)), // ₹10–₹500
      addedDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000) // random date within last 30 days
    });
  }

  return batches;
};

const seedMaterials = async () => {
  try {
    await Material.deleteMany({});
    console.log("🧹 Cleared existing materials");

    const materials = [];

    for (let i = 1; i <= 100; i++) {
      const batches = getRandomBatches();
      const available_qty = batches.reduce((sum, batch) => sum + batch.quantity, 0);

      materials.push({
        name: `Material ${i}`,
        description: `Description for Material ${i}`,
        batches,
        available_qty // 👈 Manually set, since insertMany bypasses pre('save')
      });
    }

    await Material.insertMany(materials);
    console.log("✅ 100 materials with random batches and correct available_qty seeded");
  } catch (error) {
    console.error("❌ Error seeding materials:", error);
  }
};

module.exports = seedMaterials;
