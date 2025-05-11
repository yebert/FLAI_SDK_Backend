import { Router } from "express";
import {
  createBookmark,
  deleteBookmark,
  getBookmarks,
} from "../controllers/postController";

const bookmarkRouter = Router();

bookmarkRouter.route("/").get(getBookmarks);
bookmarkRouter.route("/:id").post(createBookmark).delete(deleteBookmark);

export default bookmarkRouter;
