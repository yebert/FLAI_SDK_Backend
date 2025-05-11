import { Router } from "express";
import {
  getQuestionById,
  getQuestions,
  createPost,
  deletePost,
  updatePost,
  getTags,
  createTag,
  createAIPost,
  updateTag,
} from "../controllers/postController.js";

const forumRouter = Router();

forumRouter.route("/").get(getQuestions).post(createPost);
forumRouter
  .route("/:id")
  .get(getQuestionById)
  .put(updatePost)
  .delete(deletePost);

forumRouter.route("/tags").get(getTags).post(createTag);
forumRouter.route("/tags/:id").put(updateTag);

forumRouter.route("/ai").post(createAIPost);

export default forumRouter;
