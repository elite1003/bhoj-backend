import { DataTypes, Model } from "sequelize";
import sequelize from "../utils/database.mjs";
import Cart from "./cart.mjs";
import Recipe from "./recipe.mjs";

// CartRecipe join table for many-to-many relationship
class CartRecipe extends Model {}
CartRecipe.init(
  {
    cartId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Cart,
        key: "id",
      },
    },
    recipeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Recipe,
        key: "id",
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
      },
    },
  },
  {
    sequelize,
    modelName: "CartRecipe",
    timestamps: false,
  }
);

export default CartRecipe;
