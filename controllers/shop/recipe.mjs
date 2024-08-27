import Recipe from "../../models/recipe.mjs";
import Category from "../../models/category.mjs";

export const getRecipe = async (req, res, next) => {
  try {
    const recipes = await Recipe.findAll({
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

export const getRecipesWithGivenCategory = async (req, res, next) => {
  const { catId } = req.params;
  try {
    const recipes = await Recipe.findAll({
      where: {
        catId: catId, // Filter by catId
      },
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
