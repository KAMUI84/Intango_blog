import * as tagModel from "../models/tagmodel.js";

export const createTag = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "name is required" });
    const id = await tagModel.createTag(name);
    return res.status(201).json({ message: "Tag created", id });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") return res.status(409).json({ message: "Tag already exists" });
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const updateTag = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    await tagModel.updateTag(id, name);
    return res.json({ message: "Tag updated" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const deleteTag = async (req, res) => {
  try {
    const { id } = req.params;
    await tagModel.deleteTag(id);
    return res.json({ message: "Tag deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getTags = async (req, res) => {
  try {
    const rows = await tagModel.getAllTags();
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
