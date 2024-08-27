import express from "express";
import { upload } from "../utils/upload.mjs";
import {
  postRecipe,
  deleteRecipe,
  patchRecipe,
  getRecipe,
  getRecipes,
} from "../controllers/admin/recipe.mjs";

import { getOrders, patchOrder } from "../controllers/admin/order.mjs";

const router = express.Router();

//recipe
router.get("/recipes", getRecipes);
router.get("/recipe/:recipeId", getRecipe);
router.post("/recipe", upload.single("recipeImage"), postRecipe);
router.patch("/recipe/:recipeId", upload.single("recipeImage"), patchRecipe);
router.delete("/recipe/:recipeId", deleteRecipe);

// //category
// router.get("/category/:catId", getCategory);
// router.get("/categories", getCategories);
// router.post("/category", upload.single("categoryImage"), postCategory);
// router.patch(
//   "/category/:categoryId",
//   upload.single("categoryImage"),
//   patchCategory
// );
// router.delete("/category/:categoryId", deleteCategory);

//order
router.get("/orders", getOrders);
router.patch("/orders/:orderId", patchOrder);

export default router;
