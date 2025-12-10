import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { getUserById } from "../models/authmodel.js";
dotenv.config();

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Missing or invalid authorization header" });
    }
    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // attach user to request (non-sensitive)
    const user = await getUserById(payload.id);
    if (!user) return res.status(401).json({ message: "User no longer exists" });
    req.user = { id: user.id, role: user.role, name: user.name, email: user.email };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized", error: err.message });
  }
};
