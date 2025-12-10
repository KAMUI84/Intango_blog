import express from "express";
import { authenticate } from "../middleware/authmiddleware.js";
import { permit } from "../middleware/rolemiddleware.js";
import { createTag, updateTag, deleteTag, getTags } from "../controllers/tagcontrollers.js";

const router = express.Router();

router.get("/", getTags);

router.post("/", authenticate, permit("admin"), createTag);
router.put("/:id", authenticate, permit("admin"), updateTag);
router.delete("/:id", authenticate, permit("admin"), deleteTag);

export default router;
