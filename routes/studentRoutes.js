const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const announcementController = require('../controllers/announcementController');
const { authenticateStudent } = require('../middleware/authMiddleware');

router.get('/viewAssignments/:classId', authenticateStudent, studentController.viewAssignments);
router.post('/submitAssignment', authenticateStudent, studentController.submitAssignment);
router.patch('/updateInfo', authenticateStudent, studentController.updateStudentInfo);
router.get('/viewAnnouncements/:classId', authenticateStudent, announcementController.viewAnnouncements);
router.get('/viewAttendance/:classId/:studentId', authenticateStudent, studentController.viewAttendance);
router.post('/leaveClass', authenticateStudent, studentController.leaveClass);

module.exports = router;
