const cloudinary = require('cloudinary').v2;
const Campaign = require('../models/Campaign');
const fs = require('fs').promises;
const path = require('path');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.createCampaign = async (req, res) => {
  try {
    const { title, description, sentTo } = req.body;

    // Convert sentTo to an array if it's received as a string
    const sentToArray = sentTo.split(',').map((id) => id.trim());

    // Check if files are present in the request
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files were uploaded.' });
    }

    // Create the 'uploads' directory if it doesn't exist
    const uploadsDirectory = path.join(__dirname, '..', 'uploads');
    await fs.mkdir(uploadsDirectory, { recursive: true });

    const filePromises = req.files.map(async (file) => {
      // Save each file to the local filesystem
      const filePath = path.join(uploadsDirectory, file.originalname);
      await fs.writeFile(filePath, file.buffer);

      // Upload each file to Cloudinary
      const result = await cloudinary.uploader.upload(filePath, {
        resource_type: 'auto',
      });

      // Remove the temporary file from the local filesystem
      await fs.unlink(filePath);

      return {
        secure_url: result.secure_url,
        public_id: result.public_id,
        original_filename: file.originalname,
      };
    });
    
    // Wait for all file uploads to complete
    const uploadedFiles = await Promise.all(filePromises);

    // Save campaign details to the database
    const newCampaign = new Campaign({
      title,
      description,
      files: uploadedFiles,
      sentTo: sentToArray,
    });

    const savedCampaign = await newCampaign.save();

    res.json({ success: true, campaign: savedCampaign });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
