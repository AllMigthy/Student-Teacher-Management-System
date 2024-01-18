const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  secure_url: String,
  public_id: String,
  original_filename: String,
});

const campaignSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  files: [fileSchema],
  sentTo: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Campaign = mongoose.model('Campaign', campaignSchema);

module.exports = Campaign;
