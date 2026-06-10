const asyncHandler = require('../utils/asyncHandler');
const Notification = require('../models/Notification');

const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50);
  res.json(notifications);
});

const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOne({ _id: req.params.notificationId, user: req.user._id });
  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }

  notification.read = true;
  await notification.save();
  res.json(notification);
});

module.exports = { getNotifications, markAsRead };
