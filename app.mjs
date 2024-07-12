import dotenv from "dotenv";
dotenv.config();
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

//routes
import adminRoutes from "./routes/admin.mjs";
import shopRoutes from "./routes/shop.mjs";
import authRoutes from "./routes/auth.mjs";
import { error404 } from "./controllers/error.mjs";

const app = express();

app.use(cors());
app.use(express.static(path.join(rootDir, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
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

Category.hasMany(Recipe, { foreignKey: "catId" });
Recipe.belongsTo(Category, {
  foreignKey: "catId",
  constraints: true,
  onDelete: "CASCADE",
});

User.hasOne(Cart, { foreignKey: "userId" });
Cart.belongsTo(User, { foreignKey: "userId" });

Cart.belongsToMany(Recipe, { through: CartRecipe, foreignKey: "cartId" });
Recipe.belongsToMany(Cart, { through: CartRecipe, foreignKey: "recipeId" });

User.hasMany(Order, { foreignKey: "userId" });
Order.belongsTo(User, {
  foreignKey: "userId",
  constraints: true,
  onDelete: "CASCADE",
});

Order.belongsToMany(Recipe, { through: OrderRecipe, foreignKey: "orderId" });
Recipe.belongsToMany(Order, {
  through: OrderRecipe,
  foreignKey: "recipeId",
});

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
