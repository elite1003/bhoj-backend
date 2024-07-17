import { DataTypes, Model } from "sequelize";
import sequelize from "../utils/database.mjs";
import User from "./user.mjs";
import Address from "./address.mjs";

class Order extends Model {}

Order.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    addressId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Address,
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM("pending", "preparing", "delivered", "failed"),
      defaultValue: "pending",
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Order",
    timestamps: false,
  }
);

export default Order;
