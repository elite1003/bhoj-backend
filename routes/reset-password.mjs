import express from "express";
import { postResetPassword } from "../controllers/auth.mjs";

const router = express.Router();

router.post("/", postResetPassword);

export default router;
