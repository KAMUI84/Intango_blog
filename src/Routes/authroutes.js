import express from "express";
import { authenticate } from "../middleware/authmiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";
import { register, login } from "../controllers/authcontrollers.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", authenticate, adminOnly, register);

export default router;
