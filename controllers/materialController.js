const Material = require('../models/Material');

exports.createMaterial = async (req, res) => {
    try {
        const material = new Material(req.body);
        await material.save();
        res.status(201).json(material);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create material' });
    }
};

exports.getMaterials = async (req, res) => {
    try {
        const materials = await Material.find();
        res.json(materials);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch materials' });
    }
};
