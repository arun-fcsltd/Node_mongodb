const Material = require('../models/Material');

const createMaterial = async (req, res) => {
    try {
        const material = new Material(req.body);
        await material.save();
        res.status(201).json(material);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getAllMaterials = async (req, res) => {
    try {
        const materials = await Material.find();
        res.status(200).json(materials);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getMaterialById = async (req, res) => {
    try {
        const material = await Material.findById(req.params.id);
        if (!material) {
            return res.status(404).json({ error: 'Material not found' });
        }
        res.status(200).json(material);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateMaterial = async (req, res) => {
    try {
        const material = await Material.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!material) {
            return res.status(404).json({ error: 'Material not found' });
        }
        res.status(200).json(material);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteMaterial = async (req, res) => {
    try {
        const material = await Material.findByIdAndDelete(req.params.id);
        if (!material) {
            return res.status(404).json({ error: 'Material not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createMaterial,
    getAllMaterials,
    getMaterialById,
    updateMaterial,
    deleteMaterial
};
