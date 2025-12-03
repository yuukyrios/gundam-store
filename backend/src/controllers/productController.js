import * as productService from "../services/productService.js";

export const getProducts = async (req, res, next) => {
  try {
    res.json(await productService.getAllProducts());
  } catch (err) {
    next(err);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    res.json(await productService.getProductById(req.params.id));
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    await productService.createProduct(req.body);
    res.json({ message: "Product created" });
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    await productService.updateProduct(req.params.id, req.body);
    res.json({ message: "Product updated" });
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    await productService.deleteProduct(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    next(err);
  }
};
