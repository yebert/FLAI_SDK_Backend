import { Router } from "express";
import {
  getUserById,
  getUsers,
  createUser,
  deleteUser,
  updateUser,
} from "../controllers/userController.js";
import { login, logout, userSignup } from "../controllers/authController.js";
import authenticate from "../middlewares/authenticate.js";

const userRouter = Router();
userRouter.post("/login", login);
userRouter.post("/signup", userSignup);
userRouter.post("/logout", logout);

userRouter.route("/").get(getUsers).post(userSignup);
userRouter.route("/:id").get(getUserById).put(authenticate, updateUser).delete(authenticate, deleteUser);

export default userRouter;
