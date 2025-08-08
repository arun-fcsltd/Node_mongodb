const mongoose = require('mongoose');


const assignMaterialSchema = new mongoose.Schema({
    materialId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Material',
        required: true
    },
    batchId: {
        type: mongoose.Schema.Types.ObjectId, // manual added Index of the batch in the material's batches array
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    unitPrice: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    assignmentDate: {
        type: Date,
        default: Date.now
    }
}, { _id: false });



const complaintStatus = {
    LOGGED: 'logged',
    ASSIGNED: 'assigned',
    IN_PROGRESS: 'in-progress',
    RESOLVED: 'resolved',
    CLOSED: 'closed',
    REJECTED: 'rejected',
    PENDING: 'pending'
};

const complaintPriority = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    CRITICAL: 'critical'
};

const complaintSchema = new mongoose.Schema({
    complaint_id: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
        alias: 'complaintDescription' // Additional description field
    },
    status: {
        type: String,
        default: complaintStatus.LOGGED,
        enum: Object.values(complaintStatus)
    },
    priority: {
        type: String,
        enum: Object.values(complaintPriority),
        default: complaintPriority.MEDIUM
    },
    referenceIds: [{
        type: String
    }],
    unit: {
        type: String,
        required: true
    },
    responsiblePersonName: {
        type: String,
        required: true
    },
    responsiblePersonPhone: {
        type: String,
        required: true
    },
    refId: {
        type: String,
        required: true
    },
    assignedWorkers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User '
    }],
    requiredWorkers: {
        type: Number,
        required: true
    },
    requiredMaterials: [
        {
            material_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Material'
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ],
    assignedMaterials: [assignMaterialSchema],
    totalMaterialCost: {
        type: Number,
        default: 0
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User ',
        required: true
    },
    purchaseOrderIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PurchaseOrder'
    }],
    scrapIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ScrapItem'
    }],
    flags: {
        isResolved: {
            type: Boolean,
            default: false
        },
        isScrapped: {
            type: Boolean,
            default: false
        }
    },
    timestamps: {
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        },
        resolvedAt: {
            type: Date
        },
        scrappedAt: {
            type: Date
        }
    }
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);
