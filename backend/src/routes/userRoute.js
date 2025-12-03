import express from "express";
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser
} from "../controllers/userController.js";

import { validate } from "../validations/validate.js";
import { updateUserSchema } from "../validations/userValidation.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUser);
router.put("/:id", validate(updateUserSchema), updateUser);
router.delete("/:id", deleteUser);

export default router;
