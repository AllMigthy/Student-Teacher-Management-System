const express = require('express');
const router = express.Router();
const spreadsheetController = require('../controllers/spreadsheetController');
const { authenticateTeacher } = require('../middleware/authMiddleware');


router.post('/link-spreadsheet',authenticateTeacher, spreadsheetController.linkSpreadsheet);
router.get('/fetch-attendance/:classId',authenticateTeacher, spreadsheetController.fetchAttendance);

module.exports = router;