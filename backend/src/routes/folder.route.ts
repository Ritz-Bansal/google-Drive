import express from "express";
import { createRootFolderController } from "../controllers/folder.controller.js";

const folderRouter = express.Router();

folderRouter.post("/create", createRootFolderController);

export default folderRouter;
