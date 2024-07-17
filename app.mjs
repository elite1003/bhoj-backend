import dotenv from "dotenv";
import path from "path";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import rootDir from "./utils/root-dir.mjs";
import { verifyToken } from "./utils/jwt.mjs";
import sequelize from "./utils/database.mjs";
import { v2 as cloudinary } from "cloudinary";

//models
import User from "./models/user.mjs";
import Cart from "./models/cart.mjs";
import Recipe from "./models/recipe.mjs";
import CartRecipe from "./models/cart-recipe.mjs";
import Order from "./models/order.mjs";
import OrderRecipe from "./models/order-recipe.mjs";
import Category from "./models/category.mjs";
import Address from "./models/address.mjs";

//routes
import adminRoutes from "./routes/admin.mjs";
import shopRoutes from "./routes/shop.mjs";
import authRoutes from "./routes/auth.mjs";
import { error404 } from "./controllers/error.mjs";

dotenv.config();
const app = express();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
app.use(cors());
app.use(express.static(path.join(rootDir, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/admin", verifyToken, adminRoutes);
app.use("/shop", verifyToken, shopRoutes);
app.use("/auth", authRoutes);
app.use(error404);

//associations
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

Order.belongsToMany(Recipe, { through: OrderRecipe, foreignKey: "orderId" });
Recipe.belongsToMany(Order, {
  through: OrderRecipe,
  foreignKey: "recipeId",
});

Address.hasMany(Order, { foreignKey: "addressId" });
Order.belongsTo(Address, { foreignKey: "addressId" });

sequelize
  .sync()
  .then(() => {
    console.log("successfully connected to database");
    app.listen(4000, () => {
      console.log("Server running on port 4000");
    });
  })
  .catch((err) => {
    console.log("Error in connecting with database\n", err);
  });
