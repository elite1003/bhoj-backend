import express from "express";
import { postLogin, postSignUp } from "../controllers/auth.mjs";
import { validateSignUp } from "../utils/validator.mjs";
const router = express.Router();
router.post("/signup", validateSignUp, postSignUp);
router.post("/login", postLogin);
export default router;
