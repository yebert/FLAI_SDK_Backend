import { Router } from "express";

import {
  createFollowerConnection,
  deleteFollowerConnection,
  getAllFollowers,
} from "../controllers/userController.js";
import authenticate from "../middlewares/authenticate.js";

const followerRouter = Router();

followerRouter
  .route("/:id")
  .get(getAllFollowers)
  .post(authenticate, createFollowerConnection)
  .delete(authenticate, deleteFollowerConnection);

export default followerRouter;
