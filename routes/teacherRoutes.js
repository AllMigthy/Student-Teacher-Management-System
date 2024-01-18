// routes/teacherRoutes.js
const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const announcementController = require('../controllers/announcementController');
const { authenticateTeacher } = require('../middleware/authMiddleware');

router.post('/createClass',authenticateTeacher, teacherController.createClass);
router.post('/addAssignment',authenticateTeacher, teacherController.addAssignment);
router.post('/addStudentsToClass',authenticateTeacher, teacherController.addStudentsToClass);
router.get('/viewClasses',authenticateTeacher, teacherController.viewClasses);
router.get('/viewAssignments/:classId',authenticateTeacher, teacherController.viewAssignments);
router.post('/searchStudents', authenticateTeacher, teacherController.searchStudents);
router.post('/addAnnouncement', authenticateTeacher, announcementController.addAnnouncement);
router.get('/viewAnnouncements/:classId', authenticateTeacher, announcementController.viewAnnouncements);
router.post('/linkSpreadsheetToClass', authenticateTeacher, teacherController.linkSpreadsheetToClass);
router.get('/viewCampaigns', authenticateTeacher, teacherController.viewCampaigns);
router.post('/removeStudentFromClass', authenticateTeacher, teacherController.removeStudentFromClass);

module.exports = router;
