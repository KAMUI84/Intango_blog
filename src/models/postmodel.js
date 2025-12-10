import db from "../config/db.js";

export const createPost = async ({ title, slug, content, status = "draft", category_id = null, tag_id = null, author_id }) => {
  const sql = `INSERT INTO posts (title, slug, content, status, category_id, tag_id, author_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const [res] = await db.query(sql, [title, slug, content, status, category_id, tag_id, author_id, new Date()]);
  return res.insertId;
};

export const updatePost = async (id, fields = {}) => {
  const keys = Object.keys(fields);
  if (keys.length === 0) return;
  const values = keys.map(k => fields[k]);
  const setClause = keys.map(k => `${k} = ?`).join(", ");
  const sql = `UPDATE posts SET ${setClause} WHERE id = ?`;
  await db.query(sql, [...values, id]);
};

export const deletePost = async (id) => {
  await db.query("DELETE FROM posts WHERE id = ?", [id]);
};

export const getPostBySlug = async (slug) => {
  const sql = `
    SELECT p.*, u.name as author_name, c.name as category_name, t.name as tag_name
    FROM posts p
    LEFT JOIN users u ON p.author_id = u.id
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN tags t ON p.tag_id = t.id
    WHERE p.slug = ? AND p.status = 'published'
    LIMIT 1
  `;
  const [rows] = await db.query(sql, [slug]);
  return rows[0];
};

export const getPublishedPosts = async (filters = {}) => {
  let sql = `
    SELECT p.*, u.name as author_name, c.name as category_name, t.name as tag_name
    FROM posts p
    LEFT JOIN users u ON p.author_id = u.id
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN tags t ON p.tag_id = t.id
    WHERE p.status = 'published'
  `;
  const params = [];
  if (filters.category_id) {
    sql += " AND p.category_id = ?";
    params.push(filters.category_id);
  }
  if (filters.tag_id) {
    sql += " AND p.tag_id = ?";
    params.push(filters.tag_id);
  }
  if (filters.author_id) {
    sql += " AND p.author_id = ?";
    params.push(filters.author_id);
  }
  sql += " ORDER BY p.created_at DESC";
  const [rows] = await db.query(sql, params);
  return rows;
};

export const getPostById = async (id) => {
  const [rows] = await db.query("SELECT * FROM posts WHERE id = ? LIMIT 1", [id]);
  return rows[0];
};

export const getAllPosts = async () => {
  const [rows] = await db.query("SELECT * FROM posts ORDER BY created_at DESC");
  return rows;
};
