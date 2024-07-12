import express from "express";
import { upload } from "../utils/upload.mjs";

import {
  postRecipe,
  deleteRecipe,
  putRecipe,
  getRecipe,
} from "../controllers/admin/recipe.mjs";

const router = express.Router();

router.get("/recipe", getRecipe);
router.post("/recipe", upload.single("recipeImage"), postRecipe);
router.put("/recipe/:recipeId", upload.single("recipeImage"), putRecipe);
router.delete("/recipe/:recipeId", deleteRecipe);

export default router;
