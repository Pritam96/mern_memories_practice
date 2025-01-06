import axios from "axios";

const url = "/api/posts";

export const fetchPosts = async () => axios.get(url);

export const createPost = async (newPost) => axios.post(url, newPost);

export const updatePost = async (id, updatedPost) =>
  axios.patch(`${url}/${id}`, updatedPost);

export const deletePost = async (id) => axios.delete(`${url}/${id}`);

export const likePost = async (id) => axios.delete(`${url}/${id}/likePost`);
