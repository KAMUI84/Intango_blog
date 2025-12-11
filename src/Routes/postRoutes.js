import express from "express";
import { authenticate } from "../middleware/authmiddleware.js";
import { permit } from "../middleware/roleMiddleware.js";
import {
  createPost,
  updatePost,
  deletePost,
  getPublishedPosts,
  getPostBySlug,
  getAllPostsAdmin,
} from "../controllers/postcontrollers.js";

const router = express.Router();

// public
router.get("/published", getPublishedPosts);
router.get("/slug/:slug", getPostBySlug);

// protected
router.post("/", authenticate, permit("admin", "author"), createPost);
router.put("/:id", authenticate, permit("admin", "author"), updatePost);
router.delete("/:id", authenticate, permit("admin", "author"), deletePost);

// admin-only view all (including drafts)
router.get("/", authenticate, permit("admin"), getAllPostsAdmin);

export default router;
