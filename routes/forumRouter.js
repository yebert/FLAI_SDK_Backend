import { Router } from "express";
import {
  getPostById,
  getPosts,
  createPost,
  deletePost,
  updatePost,
  getTags,
  createTag,
  createAIPost,
  updateTag,
  deleteTag,
  searchPosts,
} from "../controllers/postController.js";
import authenticate from "../middlewares/authenticate.js";

const forumRouter = Router();

forumRouter.route("/").get(getPosts).post(authenticate, createPost);
forumRouter.route("/search").post(searchPosts);
forumRouter
  .route("/:id")
  .get(getPostById)
  .put(authenticate, updatePost)
  .delete(authenticate, deletePost);

forumRouter.route("/tags").get(getTags).post(createTag);
forumRouter.route("/tags/:id").put(authenticate, updateTag).delete(authenticate, deleteTag);

forumRouter.route("/ai/:id").post(authenticate, createAIPost);

export default forumRouter;
