import express from "express";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";

import { validate } from "../validations/validate.js";
import { productSchema } from "../validations/productValidation.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", validate(productSchema), createProduct);
router.put("/:id", validate(productSchema), updateProduct);
router.delete("/:id", deleteProduct);

export default router;
