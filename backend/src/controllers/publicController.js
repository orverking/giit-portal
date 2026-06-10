const asyncHandler = require('../utils/asyncHandler');
const Course = require('../models/Course');
const { publicContent } = require('../data/seedContent');

const getPublicContent = asyncHandler(async (req, res) => {
  const programmes = await Course.find({ published: true })
    .populate('tutor', 'name email')
    .sort({ createdAt: -1 })
    .limit(12);

  res.json({ ...publicContent, programmes });
});

module.exports = { getPublicContent };
