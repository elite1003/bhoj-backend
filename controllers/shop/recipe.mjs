import Recipe from "../../models/recipe.mjs";
import Category from "../../models/category.mjs";

export const getRecipe = async (req, res, next) => {
  try {
    const [recipes, categories] = await Promise.all([
      Recipe.findAll(),
      Category.findAll(),
    ]);
    return res.status(200).json({ recipes, categories });
  } catch (err) {
    res.status(500).json(err);
  }
};
