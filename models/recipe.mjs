import { DataTypes, Model } from "sequelize";
import sequelize from "../utils/database.mjs";
import Category from "./category.mjs";

class Recipe extends Model {}

Recipe.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    ingredients: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    catId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Category,
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "Recipe",
    timestamps: false,
  }
);

// Export the model
export default Recipe;

// Update a product by ID
export const updateRecipeById = async (recipeId, updatedData) => {
  try {
    const [updatedRows] = await Recipe.update(updatedData, {
      where: { id: recipeId },
    });
    return updatedRows > 0 ? await Recipe.findByPk(recipeId) : null;
  } catch (error) {
    throw error;
  }
};

// Delete a product by ID
export const deleteRecipeById = async (recipeId) => {
  try {
    const deletedRows = await Recipe.destroy({
      where: { id: recipeId },
    });
    return deletedRows > 0;
  } catch (error) {
    throw error;
  }
};
