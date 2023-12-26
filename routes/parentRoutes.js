// routes/parentRoutes.js
const express = require('express');
const router = express.Router();
const parentController = require('../controllers/parentController');
const { authenticateParent } = require('../middleware/authMiddleware');

// Example route with a callback function
router.get('/viewChildInfo', authenticateParent, parentController.viewChildInfo);

module.exports = router;
