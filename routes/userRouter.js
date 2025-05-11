import { Router } from "express";
import {
  getUserById,
  getUsers,
  createUser,
  deleteUser,
  updateUser,
} from "../controllers/userController.js";
import { login, userSignup } from "../controllers/authController.js";

const userRouter = Router();
userRouter.post("/login", login);
userRouter.post("/signup", userSignup);

userRouter.route("/").get(getUsers).post(createUser);
userRouter.route("/:id").get(getUserById).put(updateUser).delete(deleteUser);

export default userRouter;
