const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/registerTeacher', authController.registerTeacher);
router.post('/loginTeacher', authController.loginTeacher);
router.post('/registerStudent', authController.registerStudent);
router.post('/loginStudent', authController.loginStudent);
router.post('/logoutTeacher', authController.logoutTeacher);
router.post('/logoutStudent', authController.logoutStudent);
router.post('/registerParent', authController.registerParent);
router.post('/loginParent', authController.loginParent);
router.post('/registerAdmin', authController.registerAdmin);
router.post('/loginAdmin', authController.loginAdmin);
router.post('/logoutAdmin', authController.logoutAdmin);

module.exports = router;
