const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email'],
    },
    password: { type: String, required: true, minlength: 8, select: false },
    role: { type: String, enum: ['admin', 'superadmin'], default: 'admin' },
    avatar: { url: String, publicId: String },
    phone: String,
    isActive: { type: Boolean, default: true },
    lastLogin: Date,
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    loginAttempts: { type: Number, default: 0 },
    lockUntil: Date,
  },
  { timestamps: true }
);

adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const rounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10);
  this.password = await bcrypt.hash(this.password, rounds);
  if (!this.isNew) this.passwordChangedAt = Date.now() - 1000;
  next();
});

adminSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

adminSchema.methods.changedPasswordAfter = function (jwtIat) {
  if (this.passwordChangedAt) {
    const changedTs = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return jwtIat < changedTs;
  }
  return false;
};

adminSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

adminSchema.methods.isLocked = function () {
  return this.lockUntil && this.lockUntil > Date.now();
};

module.exports = mongoose.model('Admin', adminSchema);
