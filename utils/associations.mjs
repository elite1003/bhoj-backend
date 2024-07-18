import User from "../models/user.mjs";
import Cart from "../models/cart.mjs";
import Recipe from "../models/recipe.mjs";
import CartRecipe from "../models/cart-recipe.mjs";
import Order from "../models/order.mjs";
import OrderRecipe from "../models/order-recipe.mjs";
import Category from "../models/category.mjs";
import Address from "../models/address.mjs";
import Payment from "../models/payment.mjs";

export const associations = () => {
  User.hasMany(Recipe, { foreignKey: "userId" });
  Recipe.belongsTo(User, {
    foreignKey: "userId",
    constraints: true,
    onDelete: "CASCADE",
  });
  User.hasOne(Cart, { foreignKey: "userId" });
  Cart.belongsTo(User, { foreignKey: "userId" });

  User.hasMany(Order, { foreignKey: "userId" });
  Order.belongsTo(User, {
    foreignKey: "userId",
    constraints: true,
    onDelete: "CASCADE",
  });

  User.hasMany(Address, { foreignKey: "userId" });
  Address.belongsTo(User, { foreignKey: "userId" });

  Category.hasMany(Recipe, { foreignKey: "catId" });
  Recipe.belongsTo(Category, {
    foreignKey: "catId",
    constraints: true,
    onDelete: "CASCADE",
  });

  Recipe.belongsToMany(Cart, { through: CartRecipe, foreignKey: "recipeId" });
  Cart.belongsToMany(Recipe, { through: CartRecipe, foreignKey: "cartId" });

  Order.belongsToMany(Recipe, {
    through: OrderRecipe,
    foreignKey: "orderId",
  });
  Recipe.belongsToMany(Order, {
    through: OrderRecipe,
    foreignKey: "recipeId",
  });

  Address.hasMany(Order, { foreignKey: "addressId" });
  Order.belongsTo(Address, { foreignKey: "addressId" });

  Order.hasOne(Payment, { foreignKey: "orderId" });
  Payment.belongsTo(Order, { foreignKey: "orderId" });
};
