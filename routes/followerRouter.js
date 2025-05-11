import { Router } from "express";

import {
  createFollowerConnection,
  deleteFollowerConnection,
  getAllFollowers,
} from "../controllers/userController.js";

const followerRouter = Router();

followerRouter
  .route("/:id")
  .get(getAllFollowers)
  .post(createFollowerConnection)
  .delete(deleteFollowerConnection);

export default followerRouter;
