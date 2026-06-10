const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    conversationKey: { type: String, required: true, index: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    attachmentUrl: String,
    readAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema);
