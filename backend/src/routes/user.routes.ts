import express from "express";
import { profileController } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get("/profile", profileController);


export default userRouter;