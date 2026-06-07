import Captain from "../models/captain.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerCaptain = async ({ fullName, email, password }) => {
  const existingCaptain = await Captain.findOne({ email });
  if (existingCaptain) {
    throw new Error("Captain already exists with this email");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const captain = await Captain.create({ fullName, email, password: hashedPassword });
  return captain;
};

export const loginCaptain = async ({ email, password }) => {
  const captain = await Captain.findOne({ email }).select("+password");
  if (!captain) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, captain.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign({ _id: captain._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  return { captain, token };
};
