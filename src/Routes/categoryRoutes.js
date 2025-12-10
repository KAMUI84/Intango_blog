import express from "express";
import { authenticate } from "../middleware/authmiddleware.js";
import { permit } from "../middleware/roleMiddleware.js";
import { createCategory, updateCategory, deleteCategory, getCategories } from "../controllers/categorycontrollers.js";

const router = express.Router();

router.get("/", getCategories);

// admin-only CRUD
router.post("/", authenticate, permit("admin"), createCategory);
router.put("/:id", authenticate, permit("admin"), updateCategory);
router.delete("/:id", authenticate, permit("admin"), deleteCategory);

export default router;
