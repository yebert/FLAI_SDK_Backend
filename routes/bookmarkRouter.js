import { Router } from "express";
import {
  createBookmark,
  deleteBookmark,
  getBookmarks,
} from "../controllers/postController.js";
import authenticate from "../middlewares/authenticate.js";

const bookmarkRouter = Router();

bookmarkRouter.route("/").get(authenticate, getBookmarks);
bookmarkRouter.route("/:id").post(authenticate, createBookmark).delete(authenticate, deleteBookmark);

export default bookmarkRouter;
