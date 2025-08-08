const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');

// Existing routes
router.post('/', complaintController.createComplaint); // POST /complaints
router.get('/', complaintController.getAllComplaints); // GET /complaints
router.get('/:id', complaintController.getComplaintById); // GET /complaints/:id
router.put('/:id', complaintController.updateComplaint); // PUT /complaints/:id
router.delete('/:id', complaintController.deleteComplaint); // DELETE /complaints/:id

// New routes
router.put('/:id/status', complaintController.updateStatus); // PUT /complaints/:id/status
router.put('/:id/assign-workers', complaintController.assignWorkers); // PUT /complaints/:id/assign-workers
router.put('/:id/remove-workers', complaintController.removeAssignedWorkers); // PUT /complaints/:id/remove-workers
router.put('/:id/assign-materials', complaintController.assignMaterials); // PUT /complaints/:id/assign-materials

module.exports = router;
