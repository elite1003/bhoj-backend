import express from "express";
import { getRecipe } from "../controllers/shop/recipe.mjs";
import {
  getCart,
  postCart,
  deleteRecipeFromCart,
} from "../controllers/shop/cart.mjs";
import { getOrderWithRecipe, postOrder } from "../controllers/shop/order.mjs";

const router = express.Router();

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
