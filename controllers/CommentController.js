import CommentModel from "../models/Comment.js";
import PostModel from "../models/Post.js";

export const create = async (req, res) => {
  try {
    const postId = req.params.id;
    const comment = req.body.comment;

    if (!comment) return res.json({ message: "Comment cannot be empty!" });

    const doc = new CommentModel({
      comment: req.body.comment,
      user: req.userId,
    });

    const post = await doc.save();

    try {
      await PostModel.findByIdAndUpdate(postId, {
        $push: { comments: doc._id },
      });
    } catch (error) {
      console.log("Couldn't find post ");
    }

    res.json(post);
  } catch (error) {
    res.json({ message: "Something is wrong!" });
  }
};

export const getLastComments = async (req, res) => {
  try {
    const comments = await CommentModel.find().limit(3).populate("user").exec();

    res.json(comments);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Couldn't get comments",
    });
  }
};

export const get = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await PostModel.findById(postId);
    const list = await Promise.all(
      post.comments.map((comment) => {
        return CommentModel.findById(comment).populate("user");
      })
    );

    res.json(list);
  } catch (error) {
    res.json({ message: "Something is wrong!" });
  }
};
