import db from "../config/db.js";

export const createUser = async (name, email, hashedPassword, role = "reader") => {
  const sql = `INSERT INTO users (name, email, password, role, created_at) VALUES (?, ?, ?, ?, ?)`;
  const [result] = await db.query(sql, [name, email, hashedPassword, role, new Date()]);
  return result.insertId;
};

export const getUserByEmail = async (email) => {
  const [rows] = await db.query("SELECT id, name, email, password, role FROM users WHERE email = ?", [email]);
  return rows[0];
};

export const getUserById = async (id) => {
  const [rows] = await db.query("SELECT id, name, email, role, created_at FROM users WHERE id = ?", [id]);
  return rows[0];
};

export const getAllUsers = async () => {
  const [rows] = await db.query("SELECT id, name, email, role, created_at FROM users");
  return rows;
};
