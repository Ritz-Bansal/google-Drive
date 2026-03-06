import express from "express";
import {  createRootFileController, fetchFileController, getFolderAndFilesController, getPresignedUrlController, searchFileController } from "../controllers/file.controller.js";

const fileRouter = express.Router();

fileRouter.post("/presigned", getPresignedUrlController);
// fileRouter.post("/upload/:parentId", createParentFileController);
fileRouter.post("/upload", createRootFileController);
fileRouter.get("/fetch/:fileId", fetchFileController)

// last mein
// fileRouter.get("/allFiles", getAllFileController); -->> get all files -> images, videoos and pdfs
// fileRouter.get("/getAllImages", getAllImagesController); --> gets all images and so on
// fileRouter.get("/getAllPdfs", getAllPdfsController);
// fileRouter.get("/getAllVideos", getAllVideosController);

fileRouter.get("/search", searchFileController); // I can search for folders too bro -- wrong place to add this route here
fileRouter.get("/check", getFolderAndFilesController);


export default fileRouter;