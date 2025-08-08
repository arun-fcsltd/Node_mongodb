const mongoose = require("mongoose");
const Complaint = require("../models/Complaint");
const Material = require("../models/Material");

const seedComplaints = async () => {
  try {
    await Complaint.deleteMany();
    console.log("Cleared existing complaints");

    const materials = await Material.find({});
    if (materials.length < 1) {
      console.error("No materials found. Please seed materials first.");
      return;
    }

    const dummyUnits = ["Unit A", "Unit B", "Unit C"];
    const dummyNames = ["John Doe", "Alice Smith", "Bob Johnson"];
    const dummyPhones = ["1234567890", "9876543210", "5555555555"];
    const dummyRefIds = ["REF001", "REF002", "REF003"];

    const complaints = [];

    for (let i = 1; i <= 10; i++) {
      // Pick 2–4 random required materials
      const selectedMaterials = [...materials].sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 2);
      const requiredMaterials = selectedMaterials.map(material => ({
        material_id: material._id,
        quantity: Math.floor(Math.random() * 50) + 1
      }));

      complaints.push({
        complaint_id: `C${String(i).padStart(3, "0")}`,
        title: `Sample Complaint ${i}`,
        description: `This is the description for complaint ${i}.`,
        status: "logged", // default
        priority: ["low", "medium", "high", "critical"][Math.floor(Math.random() * 4)],
        referenceIds: [`REF-${i}`, `DOC-${i}`],
        unit: dummyUnits[i % dummyUnits.length],
        responsiblePersonName: dummyNames[i % dummyNames.length],
        responsiblePersonPhone: dummyPhones[i % dummyPhones.length],
        refId: dummyRefIds[i % dummyRefIds.length],
        requiredWorkers: Math.floor(Math.random() * 3) + 1,
        requiredMaterials,
        created_by: new mongoose.Types.ObjectId(), // Placeholder
        purchaseOrderIds: [],
        scrapIds: [],
        flags: {
          isResolved: false,
          isScrapped: false
        },
        timestamps: {
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
    }

    await Complaint.insertMany(complaints);
    console.log("✅ Complaints seeded successfully");

  } catch (error) {
    console.error("❌ Error seeding complaints:", error);
  } finally {
    mongoose.connection.close();
  }
};

module.exports = seedComplaints;
