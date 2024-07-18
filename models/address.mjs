import { Model, DataTypes } from "sequelize";
import sequelize from "../utils/database.mjs";
import User from "./user.mjs";

class Address extends Model {}

Address.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
    },
    pincode: {
      type: DataTypes.INTEGER(6),
      allowNull: false,
    },
    flatNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    areaName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    landmark: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    addressType: {
      type: DataTypes.ENUM("Home", "Work", "Other"),
      allowNull: false,
    },
  },
  { sequelize, modelName: "Address", timestamps: true }
);

export default Address;
