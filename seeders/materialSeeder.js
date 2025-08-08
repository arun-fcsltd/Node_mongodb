const Material = require('../models/Material');

const seedMaterials = async () => {
    const materials = [
        { name: 'Material A', description: 'Description A', quantity: 100 },
        { name: 'Material B', description: 'Description B', quantity: 200 },
        { name: 'Material C', description: 'Description C', quantity: 300 },
        { name: 'Material D', description: 'Description D', quantity: 400 },
        { name: 'Material E', description: 'Description E', quantity: 500 },
        { name: 'Material F', description: 'Description F', quantity: 600 },
        { name: 'Material G', description: 'Description G', quantity: 700 },
        { name: 'Material H', description: 'Description H', quantity: 800 },
        { name: 'Material I', description: 'Description I', quantity: 900 },
        { name: 'Material J', description: 'Description J', quantity: 1000 },
    ];
    await Material.deleteMany({});
    await Material.insertMany(materials);
    console.log('Materials seeded');
};

module.exports = seedMaterials;
