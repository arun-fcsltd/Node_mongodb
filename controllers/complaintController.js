const Complaint = require("../models/Complaint");
const Material = require("../models/Material");
exports.createComplaint = async (req, res) => {
  try {
    const {
      complaint_id,
      title,
      description,
      status,
      priority,
      unit,
      responsiblePersonName,
      responsiblePersonPhone,
      refId,
      requiredWorkers,
      complaintDescription,
    } = req.body;

    const complaint = new Complaint({
      complaint_id,
      title,
      description,
      status,
      priority,
      unit,
      responsiblePersonName,
      responsiblePersonPhone,
      refId,
      requiredWorkers,
      complaintDescription,
      created_by: req.user._id, // Assuming req.user contains the authenticated user's info
    });

    await complaint.save();
    res
      .status(201)
      .json({ message: "Complaint created successfully", complaint });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating complaint", error: error.message });
  }
};

exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("created_by")
      .populate("assignedWorkers");
    res.status(200).json(complaints);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching complaints", error: error.message });
  }
};

exports.getComplaintById = async (req, res) => {
  try {
    const { id } = req.params;
    const complaint = await Complaint.findById(id)
      .populate("created_by")
      .populate("assignedWorkers", "-password -__v -createdAt -updatedAt").lean();
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    res.status(200).json(complaint);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching complaint", error: error.message });
  }
};

exports.updateComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedComplaint = await Complaint.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedComplaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    res
      .status(200)
      .json({ message: "Complaint updated successfully", updatedComplaint });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating complaint", error: error.message });
  }
};

exports.deleteComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedComplaint = await Complaint.findByIdAndDelete(id);
    if (!deletedComplaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    res.status(200).json({ message: "Complaint deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting complaint", error: error.message });
  }
};

// New methods for additional routes

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Expecting status to be sent in the request body
    const updatedComplaint = await Complaint.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!updatedComplaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    res
      .status(200)
      .json({ message: "Status updated successfully", updatedComplaint });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating status", error: error.message });
  }
};

exports.assignWorkers = async (req, res) => {
  try {
    const { id } = req.params;
    const { workerIds } = req.body; // Expecting an array of worker IDs
    const updatedComplaint = await Complaint.findByIdAndUpdate(
      id,
      { $addToSet: { assignedWorkers: { $each: workerIds } } },
      { new: true }
    );
    if (!updatedComplaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    res
      .status(200)
      .json({ message: "Workers assigned successfully", updatedComplaint });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error assigning workers", error: error.message });
  }
};

exports.removeAssignedWorkers = async (req, res) => {
  try {
    const { id } = req.params;
    const { workerIds } = req.body; // Expecting an array of worker IDs to remove
    const updatedComplaint = await Complaint.findByIdAndUpdate(
      id,
      { $pull: { assignedWorkers: { $in: workerIds } } },
      { new: true }
    );
    if (!updatedComplaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    res
      .status(200)
      .json({ message: "Workers removed successfully", updatedComplaint });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error removing workers", error: error.message });
  }
};

//assignMaterials
exports.assignMaterials = async (req, res) => {
  const { id } = req.params;
  const { materials } = req.body; // materials: [{ materialId, qty }]

  try {
    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    for (const { materialId, qty } of materials) {
      const material = await Material.findById(materialId);
      if (!material) {
        return res
          .status(404)
          .json({ message: `Material ${materialId} not found` });
      }

      // Get all previous assignments for this material
      const previousAssignments = complaint.assignedMaterials.filter(
        (item) => item.materialId.toString() === materialId.toString()
      );

      const previousQty = previousAssignments.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      if (qty > previousQty) {
        // 🟢 Assign more (FIFO)
        let remainingQty = qty - previousQty;

        const sortedBatches = material.batches.sort(
          (a, b) => new Date(a.addedDate) - new Date(b.addedDate)
        );

        for (const batch of sortedBatches) {
          if (remainingQty <= 0) break;
          if (batch.quantity <= 0) continue;

          const consumeQty = Math.min(batch.quantity, remainingQty);
          const totalPrice = consumeQty * batch.unitPrice;

          // Record in complaint
          complaint.assignedMaterials.push({
            materialId,
            batchId: batch._id,
            quantity: consumeQty,
            unitPrice: batch.unitPrice,
            totalPrice,
            assignmentDate: new Date(),
          });

          // Deduct from material stock
          batch.quantity -= consumeQty;
          remainingQty -= consumeQty;
        }

        if (remainingQty > 0) {
          return res.status(400).json({
            message: `Insufficient stock for material ${material.name}`,
          });
        }
      } else if (qty < previousQty) {
        // 🔴 Revert quantity (LIFO)
        let toRevert = previousQty - qty;

        // Sort complaint assignments in reverse order
        for (
          let i = complaint.assignedMaterials.length - 1;
          i >= 0 && toRevert > 0;
          i--
        ) {
          const assignment = complaint.assignedMaterials[i];

          if (assignment.materialId.toString() !== materialId.toString())
            continue;

          const revertQty = Math.min(assignment.quantity, toRevert);
          assignment.quantity -= revertQty;
          assignment.totalPrice = assignment.quantity * assignment.unitPrice;
          toRevert -= revertQty;

          // Restore to correct batch by batchId
          const batch = material.batches.id(assignment.batchId);
          if (batch) {
            batch.quantity += revertQty;
          } else {
            // If batch doesn't exist, recreate it
            material.batches.push({
              _id: assignment.batchId,
              quantity: revertQty,
              unitPrice: assignment.unitPrice,
              addedDate: new Date(),
            });
          }

          // Remove assignment if now zero
          if (assignment.quantity === 0) {
            complaint.assignedMaterials.splice(i, 1);
          }
        }

        if (toRevert > 0) {
          return res.status(400).json({
            message: `Failed to revert ${toRevert} quantity for material ${material.name}`,
          });
        }
      }

      // Clean empty batches and update available_qty
      material.batches = material.batches.filter((b) => b.quantity > 0);
      material.available_qty = material.batches.reduce(
        (sum, b) => sum + b.quantity,
        0
      );
      await material.save();
    }

    // Recalculate total material cost
    complaint.totalMaterialCost = complaint.assignedMaterials.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );

    complaint.status = "assigned";
    await complaint.save();

    return res.status(200).json({
      message: "Materials assigned successfully",
      complaint,
    });
  } catch (error) {
    console.error("Error in assignMaterials:", error);
    return res.status(500).json({
      message: "Error assigning materials",
      error: error.message,
    });
  }
};
