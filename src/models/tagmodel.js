import db from "../config/db.js";

export const createTag = async (name) => {
  const sql = `INSERT INTO tags (name, created_at) VALUES (?, ?)`;
  const [res] = await db.query(sql, [name, new Date()]);
  return res.insertId;
};

export const updateTag = async (id, name) => {
  await db.query("UPDATE tags SET name = ? WHERE id = ?", [name, id]);
  return true;
};

export const deleteTag = async (id) => {
  await db.query("DELETE FROM tags WHERE id = ?", [id]);
  return true;
};

export const getAllTags = async () => {
  const [rows] = await db.query("SELECT id, name, created_at FROM tags");
  return rows;
};
