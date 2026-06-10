const asyncHandler = require('../utils/asyncHandler');
const Message = require('../models/Message');
const User = require('../models/User');
const Notification = require('../models/Notification');

const buildConversationKey = (userA, userB) => [userA.toString(), userB.toString()].sort().join('__');

const getConversations = asyncHandler(async (req, res) => {
  const messages = await Message.find({
    $or: [{ sender: req.user._id }, { recipient: req.user._id }],
  })
    .populate('sender', 'name role avatar')
    .populate('recipient', 'name role avatar')
    .sort({ createdAt: -1 });

  const map = new Map();

  messages.forEach((message) => {
    if (!map.has(message.conversationKey)) {
      const otherPerson =
        message.sender._id.toString() === req.user._id.toString() ? message.recipient : message.sender;
      map.set(message.conversationKey, {
        conversationKey: message.conversationKey,
        participant: otherPerson,
        latestMessage: message,
        unreadCount: 0,
      });
    }

    if (
      message.recipient._id.toString() === req.user._id.toString() &&
      !message.readAt &&
      map.has(message.conversationKey)
    ) {
      map.get(message.conversationKey).unreadCount += 1;
    }
  });

  res.json(Array.from(map.values()));
});

const getMessagesForConversation = asyncHandler(async (req, res) => {
  const otherUser = await User.findById(req.params.userId);
  if (!otherUser) {
    res.status(404);
    throw new Error('User not found');
  }

  const conversationKey = buildConversationKey(req.user._id, otherUser._id);
  const messages = await Message.find({ conversationKey })
    .populate('sender', 'name role avatar')
    .populate('recipient', 'name role avatar')
    .sort({ createdAt: 1 });

  await Message.updateMany(
    { conversationKey, recipient: req.user._id, readAt: { $exists: false } },
    { $set: { readAt: new Date() } }
  );

  res.json(messages);
});

const sendMessage = asyncHandler(async (req, res) => {
  const recipient = await User.findById(req.body.recipientId);
  if (!recipient) {
    res.status(404);
    throw new Error('Recipient not found');
  }

  const conversationKey = buildConversationKey(req.user._id, recipient._id);
  const message = await Message.create({
    conversationKey,
    sender: req.user._id,
    recipient: recipient._id,
    content: req.body.content,
  });

  const populated = await Message.findById(message._id)
    .populate('sender', 'name role avatar')
    .populate('recipient', 'name role avatar');

  const notification = await Notification.create({
    user: recipient._id,
    title: 'New message',
    message: `${req.user.name} sent you a message.`,
    type: 'message',
    meta: { conversationKey, senderId: req.user._id },
  });

  const io = req.app.locals.io;
  if (io) {
    io.to(`user:${recipient._id}`).emit('message:new', populated);
    io.to(`user:${recipient._id}`).emit('notification:new', notification);
  }

  res.status(201).json(populated);
});

module.exports = { getConversations, getMessagesForConversation, sendMessage };
