import * as categorymodel from "../models/categorymodel.js";

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "name is required" });
    const id = await categoryModel.createCategory(name);
    return res.status(201).json({ message: "Category created", id });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") return res.status(409).json({ message: "Category already exists" });
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    await categoryModel.updateCategory(id, name);
    return res.json({ message: "Category updated" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await categoryModel.deleteCategory(id);
    return res.json({ message: "Category deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const rows = await categoryModel.getAllCategories();
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
