import Category from "../../models/category.mjs";
import path from "path";
import rootDir from "../../utils/root-dir.mjs";
import { deleteLocalFile } from "../../utils/deleteLocalFile.mjs";

export const getCategory = async (req, res, next) => {
  try {
    const categories = await Category.findAll();
    return res.status(200).json(categories);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const postCategory = async (req, res, next) => {
  const category = req.body;
  const uploadedFile = await cloudinary.uploader.upload(req.file.path);
  deleteLocalFile(path.join(rootDir, req.file.path));
  category.imageUrl = uploadedFile.secure_url;
  category.cloudinaryPublicId = uploadedFile.public_id;

  Category.create(category)
    .then((newCategory) => res.status(201).json({ id: newCategory.id }))
    .catch((err) => res.status(400).json(err));
};

export const deleteCategory = async (req, res, next) => {
  const { categoryId } = req.params;
  const category = await Category.findByPk(categoryId);
  if (!category) {
    return res.status(400).send("couldn't find the category with given Id");
  }
  try {
    await cloudinary.uploader.destroy(category.cloudinaryPublicId);
    await category.destroy();
    return res.status(200).send("Category deleted successfully");
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const putCategory = async (req, res, next) => {
  const { categoryId } = req.params;
  const newCategory = req.body;
  try {
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(400).send("couldn't find the category with given Id");
    }
    for (const field in newCategory) {
      if (newCategory.hasOwnProperty(field)) {
        category[field] = newCategory[field];
      }
    }
    if (req.file?.path) {
      // Delete old image from Cloudinary
      await cloudinary.uploader.destroy(category.cloudinaryPublicId);
      // Upload new image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);
      deleteLocalFile(path.join(rootDir, req.file.path));
      category.imageUrl = result.secure_url;
      category.cloudinaryPublicId = result.public_id;
    }
    await category.save();
    return res.status(200).json(category);
  } catch (error) {
    res.status(500).json(error);
  }
};
