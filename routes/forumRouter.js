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
} from "../controllers/postController.js";

const forumRouter = Router();

forumRouter.route("/").get(getPosts).post(createPost);
forumRouter
  .route("/:id")
  .get(getPostById)
  .put(updatePost)
  .delete(deletePost);

forumRouter.route("/tags").get(getTags).post(createTag);
forumRouter.route("/tags/:id").put(updateTag);

forumRouter.route("/ai/:id").post(createAIPost);

export default forumRouter;
