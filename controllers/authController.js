import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/user.js";
import ErrorResponse from "../utils/ErrorResponse.js";

const createToken = (id) =>
  jwt.sign({ id }, process.env.SECRET, {
    expiresIn: `${process.env.JWT_EXPIRES_IN}d`,
  });

const setAuthCookie = (res, token) => {
  const secure = !["development", "test"].includes(process.env.NODE_ENV);
  res.cookie("token", token, {
    httpOnly: true,
    secure,
    sameSite: "none",
    expires: new Date(
      Date.now() + process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
  });
};

const userSignup = async (req, res) => {
  const { email, password } = req.body;

  const emailInUse = await User.findOne({ where: { email } });
  if (emailInUse) throw new ErrorResponse("Email already in use", 409);
  console.log("entered userSignup");
  // passw0rd hashing
  const salt = await bcrypt.genSalt(15);
  const hashedPW = await bcrypt.hash(password, salt);
  console.log("passed hashing");
  const user = await User.create({ ...req.body, password: hashedPW });
  delete user.password;
  const token = createToken(user.id);
  setAuthCookie(res, token);
  res.status(201).json({ message: "User created successfully", token, user });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) throw new ErrorResponse("Incorrect credentials", 401);

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new ErrorResponse("Incorrect credentials", 401);

  const token = createToken(user.id);

  delete user.password;
  setAuthCookie(res, token);
  res.json({ message: "Logged in", token, user });
};

const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logout successful" });
};

const getMe = async (req, res) => {
  const { id } = req.user;

  const data = await User.findById(id);
  res.json({ message: "Logged in", data });
};

export { userSignup, login, logout, getMe };
