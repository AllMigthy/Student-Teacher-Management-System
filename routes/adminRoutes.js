// routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const { authenticateAdmin } = require('../middleware/authMiddleware');
const campaignController = require('../controllers/campaignController');
const multer = require('multer');

// Configure Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
router.post('/createCampaign', authenticateAdmin, campaignController.createCampaign);

module.exports = router;
