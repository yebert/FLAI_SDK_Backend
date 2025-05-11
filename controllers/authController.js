import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/user.js";
import ErrorResponse from "../utils/ErrorResponse.js";

const createToken = (id) =>
  jwt.sign({ id }, process.env.SECRET, {
    expiresIn: "1d",
  });

const userSignup = async (req, res) => {
  const { email, password } = req.body;

  const emailInUse = await User.findOne({ where: { email } });
  if (emailInUse) throw new ErrorResponse("Email already in use", 409);

  // passw0rd hashing
  const salt = await bcrypt.genSalt(15);
  const hashedPW = await bcrypt.hash(password, salt);

  const user = await User.create({ ...req.body, password: hashedPW });
  delete user.password;
  const token = createToken(user.id);
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

  res.json({ message: "Logged in", token, user });
};

export { userSignup, login };
