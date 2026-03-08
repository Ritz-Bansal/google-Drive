import express from "express";
import { createLinkController, fetchResourceController, getLinkController, searchSharedController } from "../controllers/share.controller.js";
import authFunction from "../auth/auth.js";

const shareRouter = express.Router();

shareRouter.post("/link", authFunction ,createLinkController);
shareRouter.get("/link", authFunction ,getLinkController);
shareRouter.get("/resource", fetchResourceController);
shareRouter.get("/search", searchSharedController);

export default shareRouter;