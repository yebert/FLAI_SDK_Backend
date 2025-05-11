import { Router } from "express";
import {
  getPostById,
  getPosts,
  createPost,
  deletePost,
  updatePost,
} from "../controllers/postController.js";

const blogRouter = Router();

blogRouter.route("/").get(getPosts).post(createPost);
blogRouter.route("/:id").get(getPostById).put(updatePost).delete(deletePost);

export default blogRouter;
