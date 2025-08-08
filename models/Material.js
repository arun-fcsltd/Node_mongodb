const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    quantity: { type: Number, required: true },
});

module.exports = mongoose.model('Material', materialSchema);
