import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
import folderRouter from "./routes/folder.route.js";
import authFunction from "./auth/auth.js";
import fileRouter from "./routes/file.route.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", authRouter);

app.use(authFunction);
app.use("/folder", folderRouter);
app.use("/file", fileRouter);

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
