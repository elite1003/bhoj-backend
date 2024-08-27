import Category from "../models/category.mjs";
import { v2 as cloudinary } from "cloudinary";
import { deleteLocalFile } from "../utils/deleteLocalFile.mjs";

export const getCategory = async (req, res, next) => {
  const { catId } = req.params;
  try {
    const category = await Category.findByPk(catId);
    return res.status(200).json(category);
  } catch (err) {
    return res.status(500).json(err);
  }
};
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll();
    return res.status(200).json(
      categories.map((c) => {
        return { id: c.id, name: c.name, imageUrl: c.imageUrl };
      })
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

export const postCategory = async (req, res, next) => {
  const category = req.body;
  try {
    const uploadedFile = await cloudinary.uploader.upload(req.file.path);
    deleteLocalFile(req.file.path);
    category.imageUrl = uploadedFile.secure_url;
    category.cloudinaryPublicId = uploadedFile.public_id;
    Category.create(category)
      .then((newCategory) => res.status(201).json({ id: newCategory.id }))
      .catch((err) => res.status(400).json(err));
  } catch (error) {
    console.log(error);
    return res.status(500).json(`internal server error ${error}`);
  }
};

// export const deleteCategory = async (req, res, next) => {
//   const { categoryId } = req.params;
//   const category = await Category.findByPk(categoryId);
//   if (!category) {
//     return res.status(400).send("couldn't find the category with given Id");
//   }
//   try {
//     await cloudinary.uploader.destroy(category.cloudinaryPublicId);
//     await category.destroy();
//     return res.status(200).send("Category deleted successfully");
//   } catch (error) {
//     return res.status(500).json(error);
//   }
// };

// export const patchCategory = async (req, res, next) => {
//   const { categoryId } = req.params;
//   const newCategory = req.body;
//   try {
//     const category = await Category.findByPk(categoryId);
//     if (!category) {
//       return res.status(400).send("couldn't find the category with given Id");
//     }
//     for (const field in newCategory) {
//       category[field] = newCategory[field];
//     }
//     if (req.file?.path) {
//       // Delete old image from Cloudinary
//       await cloudinary.uploader.destroy(category.cloudinaryPublicId);
//       // Upload new image to Cloudinary
//       const result = await cloudinary.uploader.upload(req.file.path);
//       deleteLocalFile(req.file.path);
//       category.imageUrl = result.secure_url;
//       category.cloudinaryPublicId = result.public_id;
//     }
//     await category.save();
//     return res.status(200).json(category);
//   } catch (error) {
//     return res.status(500).json(error);
//   }
// };
