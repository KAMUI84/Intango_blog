import * as postModel from "../models/postmodel.js";
import { generateSlug } from "../utils/helper.js";

export const createPost = async (req, res) => {
  try {
    const { title, content, status, category_id, tag_id } = req.body;
    if (!title || !content) return res.status(400).json({ message: "title and content required" });

    const slug = generateSlug(title);
    const id = await postModel.createPost({
      title,
      slug,
      content,
      status: status || "draft",
      category_id: category_id || null,
      tag_id: tag_id || null,
      author_id: req.user.id,
    });
    return res.status(201).json({ message: "Post created", id });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") return res.status(409).json({ message: "Slug already exists" });
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await postModel.getPostById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Only admin or author owning the post can edit
    if (req.user.role !== "admin" && post.author_id !== req.user.id) {
      return res.status(403).json({ message: "Forbidden: cannot edit this post" });
    }

    const fields = {};
    const { title, content, status, category_id, tag_id } = req.body;
    if (title) {
      fields.title = title;
      fields.slug = generateSlug(title);
    }
    if (content) fields.content = content;
    if (status) fields.status = status;
    if (typeof category_id !== "undefined") fields.category_id = category_id;
    if (typeof tag_id !== "undefined") fields.tag_id = tag_id;

    await postModel.updatePost(id, fields);
    return res.json({ message: "Post updated" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await postModel.getPostById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (req.user.role !== "admin" && post.author_id !== req.user.id) {
      return res.status(403).json({ message: "Forbidden: cannot delete this post" });
    }

    await postModel.deletePost(id);
    return res.json({ message: "Post deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getPublishedPosts = async (req, res) => {
  try {
    const filters = {};
    const { category, tag, author } = req.query;
    if (category) filters.category_id = category;
    if (tag) filters.tag_id = tag;
    if (author) filters.author_id = author;

    const rows = await postModel.getPublishedPosts(filters);
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const row = await postModel.getPostBySlug(slug);
    if (!row) return res.status(404).json({ message: "Post not found" });
    return res.json(row);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Admin-only route to get all posts (including drafts)
export const getAllPostsAdmin = async (req, res) => {
  try {
    const rows = await postModel.getAllPosts();
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
