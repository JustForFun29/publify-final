import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";
import {
  registerValidation,
  loginValidation,
  postCreateValidation,
} from "./validations.js";
import { UserController, PostController, CommentController } from "./controllers/index.js";
import { handleValidationErrors, checkAuth } from "./utils/index.js";

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });
app.use(cors());

mongoose
  .connect(
    "mongodb+srv://admin:123@cluster0.4vcemjq.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB is connected successfully"))
  .catch((err) => console.log("DB error", err));

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.post(
  "/auth/login",
  loginValidation,
  handleValidationErrors,
  UserController.login
);
app.post(
  "/auth/register",
  registerValidation,
  handleValidationErrors,
  UserController.register
);
app.get("/auth/me", checkAuth, UserController.getMe);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.post("/comments/:id", checkAuth, CommentController.create)
app.get("/comments", CommentController.getLastComments)
app.get("/comments/:id", CommentController.get)

app.get("/posts", PostController.getAll);
app.get("/posts/popular", PostController.getPopular);
app.get("/tags", PostController.getLastTags);
app.get("/posts/:id", PostController.getOne);
app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.create
);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch(
  "/posts/:id",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.update
);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server OK");
});
