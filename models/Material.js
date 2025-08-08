const mongoose = require("mongoose");

const batchSchema = new mongoose.Schema({
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  addedDate: { type: Date, default: Date.now },
});

const materialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  batches: [batchSchema],
  available_qty: { type: Number, default: 0 },
});

// Pre-save hook to calculate available_qty
materialSchema.pre("save", function (next) {
  this.available_qty = this.batches.reduce(
    (total, batch) => total + batch.quantity,
    0
  );
  next();
});

module.exports = mongoose.model("Material", materialSchema);
