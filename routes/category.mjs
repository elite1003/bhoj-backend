import express from "express";
import { upload } from "../utils/upload.mjs";

import {
  getCategories,
  getCategory,
  postCategory,
} from "../controllers/category.mjs";

const router = express.Router();

//category
router.get("/:catId", getCategory);
router.get("/", getCategories);
router.post("/", upload.single("categoryImage"), postCategory);
// router.patch(
//   "/category/:categoryId",
//   upload.single("categoryImage"),
//   patchCategory
// );
// router.delete("/category/:categoryId", deleteCategory);

export default router;
