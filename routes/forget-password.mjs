import express from "express";
import { postForgetPassword } from "../controllers/auth.mjs";

const router = express.Router();

router.post("/", postForgetPassword);

export default router;
