import { DataTypes, Model } from "sequelize";
import sequelize from "../utils/database.mjs";
import User from "./user.mjs";

//one to one relation between cart and user
class Cart extends Model {}
Cart.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "Cart",
    timestamps: false,
  }
);

export default Cart;
