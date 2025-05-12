import { Router } from "express";
import {
  getPostById,
  getPosts,
  createPost,
  deletePost,
  updatePost,
  searchPosts,
} from "../controllers/postController.js";
import authenticate from "../middlewares/authenticate.js";

const blogRouter = Router();

blogRouter.route("/").get(getPosts).post(authenticate, createPost);
blogRouter.route("/search").post(searchPosts);
blogRouter.route("/:id").get(getPostById).put(authenticate, updatePost).delete(authenticate, deletePost);

export default blogRouter;
