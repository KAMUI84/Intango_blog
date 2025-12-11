import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { createUser, getUserByEmail, getUserById } from "../models/authmodel.js";

dotenv.config();
const SALT_ROUNDS = 10;

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email & password are required" });
    }

    const exists = await getUserByEmail(email);
    if (exists) return res.status(409).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);

    // ✔ Only admins can select a custom role
    const assignedRole = req.user?.role === "admin" ? (role || "reader") : "reader";

    const newId = await createUser(name, email, hashed, assignedRole);
    const user = await getUserById(newId);

    return res.status(201).json({
      message: "User created",
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });

  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email & password required" });

    const user = await getUserByEmail(email);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    return res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });

  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
