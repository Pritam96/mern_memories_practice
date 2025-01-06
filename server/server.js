import express from "express";
import bodyParser from "body-parser";
// import cors from "cors";
import dotenv from "dotenv";

import postRoutes from "./routes/posts.js";
import connectDB from "./config/db.js";

dotenv.config({ path: "./config/config.env" });

connectDB();
const app = express();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
// app.use(cors());

app.use("/api/posts", postRoutes);
app.use("/", (req, res) => {
  res.send("Hello to Memories API");
});

const PORT = process.env.PORT || 5000;
app.listen(5000, () => console.log(`Server running on port: ${PORT}`));
