import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { getBlogs, getBlogById, getBlogsByYear, createBlog, updateBlog, deleteBlog } from "../controllers/blogController";

const router = express.Router();

router.get("/", getBlogs);
router.get("/:id", getBlogById);
router.get("/year/:year", getBlogsByYear);
router.post("/", authMiddleware, createBlog);
router.put("/:id", authMiddleware, updateBlog);
router.delete("/:id", authMiddleware, deleteBlog);

export default router;
