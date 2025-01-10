import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";

export const getPosts = async (req, res) => {
  try {
    const postMessages = await PostMessage.find();
    res.status(200).json(postMessages);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  const post = req.body;
  const newPost = new PostMessage({
    ...post,
    creator: req.userId,
    createdAt: new Date().toISOString(),
  });

  try {
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  const { id: _id } = req.params;
  const post = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    res.status(404).send(`No post with that ${_id}`);

  const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, {
    new: true,
  });
  res.status(200).json(updatedPost);
};

export const deletePost = async (req, res) => {
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id))
    res.status(404).send(`No post with that ${_id}`);

  await PostMessage.findByIdAndDelete(_id);
  res.status(200).json({ message: "Post deleted successfully." });
};

export const likePost = async (req, res) => {
  const { id: _id } = req.params;

  if (!req.userId) return res.status(401).json({ message: "Unauthenticated" });

  if (!mongoose.Types.ObjectId.isValid(_id))
    res.status(404).send(`No post with that ${_id}`);

  const post = await PostMessage.findById(_id);

  const index = post.likes.findIndex((id) => id === req.userId.toString());

  if (index === -1) {
    // like
    post.likes.push(req.userId);
  } else {
    // dislike
    post.likes = post.likes.filter((id) => id !== req.userId.toString());
  }

  const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, {
    new: true,
  });
  res.status(200).json(updatedPost);
};
