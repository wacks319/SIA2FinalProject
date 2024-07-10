const express = require('express');
const router = express.Router();
const { createReport, getReports, getReportById, updateReport, deleteReport, recordTransaction } = require('../controllers/reportControllers');
 
// Create a new report
router.post('/', createReport);
 
// Get all reports
router.get('/', getReports);
 
// Get a single report by ID
router.get('/:id', getReportById);
 
// Update a report
router.put('/:id', updateReport);
 
// Delete a report
router.delete('/:id', deleteReport);
 
// Record transaction
router.post('/record', recordTransaction);
 
module.exports = router;
 