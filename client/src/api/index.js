import axios from "axios";

const API = axios.create({ baseURL: "/api" });

API.interceptors.request.use((req) => {
  if (localStorage.getItem("profile")) {
    req.headers.Authorization = `Bearer ${
      JSON.parse(localStorage.getItem("profile")).token
    }`;
  }
  return req;
});

export const fetchPosts = async () => API.get("/posts");
export const createPost = async (newPost) => API.post("/posts", newPost);
export const updatePost = async (id, updatedPost) =>
  API.patch(`/posts/${id}`, updatedPost);
export const deletePost = async (id) => API.delete(`/posts/${id}`);
export const likePost = async (id) => API.delete(`/posts/${id}/likePost`);

export const signIn = async (formData) => API.post("/user/signin", formData);
export const signUp = async (formData) => API.post("/user/signup", formData);
