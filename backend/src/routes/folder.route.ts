import express from "express";
import { createFolderController, createRootFolderController } from "../controllers/folder.controller.js";

const folderRouter = express.Router();

folderRouter.post("/create/:parentId", createFolderController); // create a folder inside a folder
folderRouter.post("/create", createRootFolderController);


export default folderRouter;