import express from "express";
import { createBlog, getBlogs, getBlogById, updateBlog, deleteBlog, likeBlog } from "../controllers/blogController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { addComment, getComments, deleteComment } from "../controllers/commentController.js";
import upload from "../middleware/uploadMiddleware.js";
const router = express.Router();

router.post("/", authMiddleware, upload.single("content"), createBlog);
router.get("/", getBlogs);
router.get("/:id", getBlogById);
router.put("/:id", authMiddleware, upload.single("content"), updateBlog);
router.delete("/:id", authMiddleware, deleteBlog);
router.post("/:id/like", likeBlog);
router.post("/:id/comments", addComment);
router.get("/:id/comments", getComments);
router.delete("/comments/:id", authMiddleware, deleteComment);

export default router;