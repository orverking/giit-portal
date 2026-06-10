const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const achievementSchema = new mongoose.Schema(
  {
    title: String,
    icon: String,
    earnedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['student', 'tutor', 'admin'], default: 'student' },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    avatar: String,
    phone: String,
    bio: String,
    programme: String,
    studentNumber: String,
    expertise: [String],
    campus: { type: String, default: 'Makerere' },
    streak: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },
    progressSnapshot: { type: Number, default: 0 },
    achievements: [achievementSchema],
    isActive: { type: Boolean, default: true },
    lastLoginAt: Date,
  },
  { timestamps: true }
);

userSchema.pre('save', async function save(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function matchPassword(enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
