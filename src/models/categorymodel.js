import db from "../config/db.js";

export const createCategory = async (name) => {
  const sql = `INSERT INTO categories (name, created_at) VALUES (?, ?)`;
  const [res] = await db.query(sql, [name, new Date()]);
  return res.insertId;
};

export const updateCategory = async (id, name) => {
  const sql = `UPDATE categories SET name = ? WHERE id = ?`;
  await db.query(sql, [name, id]);
  return true;
};

export const deleteCategory = async (id) => {
  await db.query("DELETE FROM categories WHERE id = ?", [id]);
  return true;
};

export const getAllCategories = async () => {
  const [rows] = await db.query("SELECT id, name, created_at FROM categories");
  return rows;
};
