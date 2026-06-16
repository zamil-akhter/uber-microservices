const userSchema = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * Service to register a new user in the database
 */
const registerUser = async ({ fullName, email, password }) => {
  const existingUser = await userSchema.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists with this email');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userSchema.create({ fullName, email, password: hashedPassword });
  return user;
};

/**
 * Service to authenticate and log in an existing user
 */
const loginUser = async ({ email, password }) => {
  const user = await userSchema.findOne({ email }).select('+password');
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  const token = jwt.sign({ _id: user._id, role: "user" }, process.env.JWT_SECRET, { expiresIn: '1h' });

  return { user, token };
};

module.exports = { registerUser, loginUser };