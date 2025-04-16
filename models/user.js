const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

userSchema.pre('save', async  (next) => {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  const PEPPER = process.env.PEPPER;
  this.password = await bcrypt.hash(this.password + PEPPER, salt);
  next();
});

module.exports = mongoose.model('User', userSchema);