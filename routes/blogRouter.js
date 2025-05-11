import { Router } from "express";
import {
  getBlogById,
  getBlogs,
  createPost,
  deletePost,
  updatePost,
} from "../controllers/postController.js";

const blogRouter = Router();

blogRouter.route("/").get(getBlogs).post(createPost);
blogRouter.route("/:id").get(getBlogById).put(updatePost).delete(deletePost);

export default blogRouter;
