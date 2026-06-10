const asyncHandler = require('../utils/asyncHandler');
const CalendarEvent = require('../models/CalendarEvent');

const getEvents = asyncHandler(async (req, res) => {
  const events = await CalendarEvent.find({ user: req.user._id }).sort({ start: 1 });
  res.json(events);
});

const createEvent = asyncHandler(async (req, res) => {
  const event = await CalendarEvent.create({
    user: req.user._id,
    title: req.body.title,
    description: req.body.description,
    start: req.body.start,
    end: req.body.end,
    type: req.body.type,
    color: req.body.color,
    course: req.body.course || null,
  });

  res.status(201).json({ message: 'Study planner updated successfully', event });
});

const updateEvent = asyncHandler(async (req, res) => {
  const event = await CalendarEvent.findOne({ _id: req.params.eventId, user: req.user._id });
  if (!event) {
    res.status(404);
    throw new Error('Calendar event not found');
  }

  Object.assign(event, req.body);
  await event.save();

  res.json({ message: 'Event updated successfully', event });
});

module.exports = { getEvents, createEvent, updateEvent };
