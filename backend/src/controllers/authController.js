const asyncHandler = require('../utils/asyncHandler');
const generateToken = require('../utils/generateToken');
const User = require('../models/User');
const Notification = require('../models/Notification');

const buildAuthPayload = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status,
  avatar: user.avatar,
  phone: user.phone,
  bio: user.bio,
  programme: user.programme,
  studentNumber: user.studentNumber,
  expertise: user.expertise,
  streak: user.streak,
  xp: user.xp,
  progressSnapshot: user.progressSnapshot,
  achievements: user.achievements,
  campus: user.campus,
  token: generateToken(user._id),
});

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone, programme, expertise } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error('A user with this email already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    phone,
    programme,
    expertise: Array.isArray(expertise)
      ? expertise
      : expertise
      ? String(expertise)
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
      : [],
    role: role === 'tutor' ? 'tutor' : 'student',
    status: 'pending',
  });

  const admins = await User.find({ role: 'admin' }).select('_id');
  if (admins.length) {
    await Notification.insertMany(
      admins.map((admin) => ({
        user: admin._id,
        title: 'New approval request',
        message: `${user.name} registered as a ${user.role} and is awaiting approval.`,
        type: 'approval',
        meta: { applicantId: user._id },
      }))
    );
  }

  res.status(201).json({
    message: 'Registration submitted successfully. An admin must approve your account before you can log in.',
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error('This account has been deactivated');
  }

  if (user.role !== 'admin' && user.status !== 'approved') {
    res.status(403);
    throw new Error(
      user.status === 'rejected'
        ? 'Your account registration was not approved. Please contact GIIT.'
        : 'Your account is pending approval by the admin.'
    );
  }

  user.lastLoginAt = new Date();
  await user.save();

  res.json({ message: 'Login successful', user: buildAuthPayload(user) });
});

const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.json(user);
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.name = req.body.name || user.name;
  user.phone = req.body.phone || user.phone;
  user.bio = req.body.bio || user.bio;
  user.programme = req.body.programme || user.programme;
  user.avatar = req.body.avatar || user.avatar;
  if (req.body.expertise) {
    user.expertise = Array.isArray(req.body.expertise)
      ? req.body.expertise
      : String(req.body.expertise)
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean);
  }
  if (req.body.password) {
    user.password = req.body.password;
  }

  const updatedUser = await user.save();
  res.json({ message: 'Profile updated successfully', user: buildAuthPayload(updatedUser) });
});

module.exports = { register, login, getMe, updateProfile };
