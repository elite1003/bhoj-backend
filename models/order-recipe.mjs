import { DataTypes, Model } from "sequelize";
import sequelize from "../utils/database.mjs";
import Order from "./order.mjs";
import Recipe from "./recipe.mjs";

// OrderRecipe join table for many-to-many relationship
class OrderRecipe extends Model {}
OrderRecipe.init(
  {
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Order,
        key: "id",
      },
    },
    recipeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Recipe,
        key: "id",
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
  },
  {
    sequelize,
    modelName: "OrderProduct",
    timestamps: false,
  }
);

export default OrderProduct;
