import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";

export const getPosts = async (req, res) => {
  const { page } = req.query;

  try {
    // Number of posts to display per page
    const LIMIT = 8;

    // Calculate the starting index for fetching posts
    // Example:
    // If page = 3, startIndex = (3-1)*8 = 16 (skip the first 16 posts)
    const startIndex = (Number(page) - 1) * LIMIT;

    // Get the total number of posts in the database
    const total = await PostMessage.countDocuments({});

    // Fetch posts with sorting, limiting, and skipping
    // Example:
    // - For page 3: Fetch 8 posts from index 16 to 23
    const posts = await PostMessage.find()
      .sort({ _id: -1 }) // Sort by newest posts first
      .limit(LIMIT) // Limit the number of posts per page
      .skip(startIndex); // Skip posts based on the starting index

    res.status(200).json({
      data: posts, // Array of posts for the current page
      currentPage: Number(page), // Current page number
      numberOfPages: Math.ceil(total / LIMIT), // Total number of pages (rounded up)
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const getPostsBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;
  try {
    const title = new RegExp(searchQuery, "i");
    const posts = await PostMessage.find({
      $or: [{ title }, { tags: { $in: tags.split(",") } }],
    });
    res.status(200).json(posts);
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
