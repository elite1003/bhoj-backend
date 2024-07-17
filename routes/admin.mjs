import express from "express";
import { upload } from "../utils/upload.mjs";
import {
  postRecipe,
  deleteRecipe,
  putRecipe,
  getRecipe,
} from "../controllers/admin/recipe.mjs";

import {
  getCategory,
  postCategory,
  putCategory,
  deleteCategory,
} from "../controllers/admin/category.mjs";

import { getOrder, putOrder } from "../controllers/admin/order.mjs";

const router = express.Router();

router.get("/recipe", getRecipe);
router.post("/recipe", upload.single("recipeImage"), postRecipe);
router.put("/recipe/:recipeId", upload.single("recipeImage"), putRecipe);
router.delete("/recipe/:recipeId", deleteRecipe);

router.get("/category", getCategory);
router.post("/category", upload.single("categoryImage"), postCategory);
router.put(
  "/category/:categoryId",
  upload.single("categoryImage"),
  putCategory
);
router.delete("/category/:categoryId", deleteCategory);

router.get("/order", getOrder);
router.put("/order/:orderId", putOrder);

export default router;
