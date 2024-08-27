import express from "express";
import {
  getCart,
  postCart,
  deleteRecipeFromCart,
} from "../controllers/user/cart.mjs";
import { getOrderWithRecipe, postOrder } from "../controllers/user/order.mjs";
import {
  getProfile,
  patchProfile,
  deleteProfile,
} from "../controllers/user/profile.mjs";

const router = express.Router();

//profile
router.get("/profile", getProfile);
router.patch("/profile", patchProfile);
router.delete("/profile", deleteProfile);

//cart route
router.get("/cart", getCart);
router.post("/cart", postCart);
router.delete("/cart/:recipeId", deleteRecipeFromCart);

//order route
router.get("/orders", getOrderWithRecipe);
router.post("/order", postOrder);

export default router;
