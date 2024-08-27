import Recipe from "../../models/recipe.mjs";
import Category from "../../models/category.mjs";
import { v2 as cloudinary } from "cloudinary";
import { deleteLocalFile } from "../../utils/deleteLocalFile.mjs";

export const getRecipe = async (req, res, next) => {
  const { recipeId } = req.params;
  try {
    const recipe = await Recipe.findByPk(recipeId, {
      include: [
        {
          model: Category, // Include the Category model
          attributes: ["name"], // specify which attributes to include
        },
      ],
    });
    const modifiedRecipe = {
      id: recipe.id,
      name: recipe.name,
      catId: recipe.catId,
      catName: recipe.Category.name,
      price: recipe.price,
      imageUrl: recipe.imageUrl,
      ingredients: recipe.ingredients,
    };
    return res.status(200).json(modifiedRecipe);
  } catch (err) {
    return res.status(500).json(err);
  }
};
export const getRecipes = async (req, res, next) => {
  try {
    const recipes = await req.user.getRecipes({
      include: [
        {
          model: Category, // Include the Category model
          attributes: ["name"], // specify which attributes to include
        },
      ],
    });
    return res.status(200).json(
      recipes.map((r) => ({
        id: r.id,
        name: r.name,
        catId: r.catId,
        catName: r.Category.name,
        price: r.price,
        imageUrl: r.imageUrl,
        ingredients: r.ingredients,
      }))
    );
  } catch (err) {
    res.status(500).json(err);
  }
};

export const postRecipe = async (req, res, next) => {
  const recipe = req.body;
  const uploadedFile = await cloudinary.uploader.upload(req.file.path);
  deleteLocalFile(req.file.path);
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

export const patchRecipe = async (req, res, next) => {
  const { recipeId } = req.params;
  const newRecipe = req.body;
  try {
    const recipe = await Recipe.findByPk(recipeId);
    if (!recipe) return res.status(404).json("recipe not found");
    for (const field in newRecipe) {
      recipe[field] = newRecipe[field];
    }
    if (req.file?.path) {
      // Delete old image from Cloudinary
      await cloudinary.uploader.destroy(recipe.cloudinaryPublicId);
      // Upload new image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);
      deleteLocalFile(req.file.path);
      recipe.imageUrl = result.secure_url;
      recipe.cloudinaryPublicId = result.public_id;
    }
    await recipe.save();
    const modifiedRecipe = {
      id: recipe.id,
      name: recipe.name,
      catId: recipe.catId,
      catName: recipe.Category.name,
      price: recipe.price,
      imageUrl: recipe.imageUrl,
      ingredients: recipe.ingredients,
    };
    return res.status(200).json(modifiedRecipe);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
