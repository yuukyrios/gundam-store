import express from "express";
import { validate } from "../validations/validate.js";
import { registerSchema, loginSchema } from "../validations/authValidation.js";
import { registerUser, loginUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", validate(registerSchema), registerUser);
router.post("/login", validate(loginSchema), loginUser);

export default router;
