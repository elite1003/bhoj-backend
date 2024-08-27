import {
  getRecipe,
  getRecipesWithGivenCategory,
} from "../controllers/shop/recipe.mjs";
import express from "express";

const router = express.Router();

//recipe route
router.get("/", getRecipe);
router.get("/recipe/:catId", getRecipesWithGivenCategory);

export default router;
