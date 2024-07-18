import { DataTypes, Model } from "sequelize";
import sequelize from "../utils/database.mjs";
import Order from "./order.mjs";

class Payment extends Model {}

Payment.init(
  {
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Order,
        key: "id",
      },
    },
    paymentMethod: {
      type: DataTypes.ENUM("COD", "UPI", "Credit Card", "Debit Card", ""),
      allowNull: false,
    },
    paymentStatus: {
      type: DataTypes.ENUM("Pending", "Completed", "Failed"),
      allowNull: false,
    },
  },
  { sequelize, modelName: "Payment", timestamps: true }
);

export default Payment;
