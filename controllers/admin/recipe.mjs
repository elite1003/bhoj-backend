import Recipe from "../../models/recipe.mjs";
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import rootDir from "../../utils/root-dir.mjs";
import { deleteLocalFile } from "../../utils/deleteLocalFile.mjs";

export const getRecipe = async (req, res, next) => {
  try {
    const recipes = await req.user.getRecipes();
    return res.status(200).json(recipes);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const postRecipe = async (req, res, next) => {
  const recipe = req.body;
  const uploadedFile = await cloudinary.uploader.upload(req.file.path);
  deleteLocalFile(path.join(rootDir, req.file.path));
  recipe.imageUrl = uploadedFile.secure_url;
  recipe.cloudinaryPublicId = uploadedFile.public_id;

  req.user
    .createRecipe(recipe)
    .then((newRecipe) => res.status(201).json({ id: newRecipe.id }))
    .catch((err) => res.status(400).json(err));
};

export const deleteRecipe = async (req, res, next) => {
  const { recipeId } = req.params;
  const recipe = await Recipe.findByPk(recipeId);
  if (!recipe) {
    return res.status(400).send("couldn't find the recipe with given Id");
  }
  try {
    await cloudinary.uploader.destroy(recipe.cloudinaryPublicId);
    await recipe.destroy();
    return res.status(200).send("Recipe deleted successfully");
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const putRecipe = async (req, res, next) => {
  const { recipeId } = req.params;
  const newRecipe = req.body;
  try {
    const recipe = await Recipe.findByPk(recipeId);
    for (const field in newRecipe) {
      if (newRecipe.hasOwnProperty(field)) {
        recipe[field] = newRecipe[field];
      }
    }
    if (req.file?.path) {
      // Delete old image from Cloudinary
      await cloudinary.uploader.destroy(recipe.cloudinaryPublicId);
      // Upload new image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);
      deleteLocalFile(path.join(rootDir, req.file.path));
      recipe.imageUrl = result.secure_url;
      recipe.cloudinaryPublicId = result.public_id;
    }
    await recipe.save();
    return res.status(200).json(recipe);
  } catch (error) {
    res.status(400).json(error);
  }
};
