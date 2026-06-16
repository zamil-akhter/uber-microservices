const Captain = require('../models/captain.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * Service to register a new captain
 */
const registerCaptain = async ({ fullName, email, password }) => {
  const existingCaptain = await Captain.findOne({ email });
  if (existingCaptain) {
    throw new Error("Captain already exists with this email");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const captain = await Captain.create({ fullName, email, password: hashedPassword });
  return captain;
};

/**
 * Service to authenticate and login a captain
 */
const loginCaptain = async ({ email, password }) => {
  const captain = await Captain.findOne({ email }).select("+password");
  if (!captain) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, captain.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign({ _id: captain._id, role: "captain" }, process.env.JWT_SECRET, { expiresIn: "1h" });
  return { captain, token };
};

/**
 * Service to get captain by ID
 */
const getCaptainById = async ({ captainId }) => {
  if (!captainId) {
    throw new Error("Captain ID is required");
  }

  const captain = await Captain.findById(captainId);
  if (!captain) {
    throw new Error("Captain not found");
  }

  return captain;
};


module.exports = { registerCaptain, loginCaptain, getCaptainById };