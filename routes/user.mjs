import express from "express";
import { getRecipe } from "../controllers/shop/recipe.mjs";
import {
  getCart,
  postCart,
  deleteRecipeFromCart,
} from "../controllers/shop/cart.mjs";
import { getOrderWithRecipe, postOrder } from "../controllers/shop/order.mjs";

import {
  getProfile,
  putProfile,
  deleteProfile,
} from "../controllers/user/profile.mjs";

const router = express.Router();

//profile
router.get("/profile", getProfile);
router.put("/profile", putProfile);
router.delete("/profile", deleteProfile);

//recipe route
router.get("/recipe", getRecipe);

//cart route
router.get("/cart", getCart);
router.post("/cart", postCart);
router.delete("/cart/:recipeId", deleteRecipeFromCart);

//order route
router.get("/order", getOrderWithRecipe);
router.post("/order", postOrder);

export default router;
