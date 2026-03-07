import express from "express";
import { createLinkController, fetchResourceController, getLinkController } from "../controllers/share.controller.js";
import authFunction from "../auth/auth.js";

const shareRouter = express.Router();

shareRouter.post("/link", authFunction ,createLinkController);
shareRouter.get("/link", authFunction ,getLinkController);
shareRouter.get("/resource", fetchResourceController);

export default shareRouter;