import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { getUserById } from "../models/authmodel.js";
dotenv.config();

export const authenticate = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "only Admins can create an account for you!!! sorry my guy check out Mr.Jigson  to help you" });
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await getUserById(decoded.id);
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = { id: user.id, role: user.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized", error: err.message });
  }
};
export const verifytoken = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers["x-access-token"]};