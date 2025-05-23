import { Router } from "express";
import {
  getUserById,
  getUsers,
  createUser,
  deleteUser,
  updateUser,
  getPostsOfUserInterests
} from "../controllers/userController.js";
import {
  getMe,
  login,
  logout,
  userSignup,
} from "../controllers/authController.js";
import authenticate from "../middlewares/authenticate.js";

const userRouter = Router();
userRouter.post("/login", login);
userRouter.post("/signup", userSignup);
userRouter.post("/logout", logout);
userRouter.get("/me", authenticate, getMe);
userRouter.route("/").get(getUsers).post(userSignup);
userRouter.route("/interests/:id").get(getPostsOfUserInterests);
userRouter
  .route("/:id")
  .get(getUserById)
  .put(authenticate, updateUser)
  .delete(authenticate, deleteUser);

export default userRouter;
