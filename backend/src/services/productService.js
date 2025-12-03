import { db } from "../config/db.js";

export const getAllProducts = async () => {
  const [rows] = await db.query("SELECT * FROM product");
  return rows;
};

export const getProductById = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM product WHERE id = ?",
    [id]
  );
  return rows[0];
};

export const createProduct = async (data) => {
  const { name, grade, price, link } = data;

  await db.query(
    "INSERT INTO product (name, grade, price, link) VALUES (?, ?, ?, ?)",
    [name, grade, price, link]
  );
};

export const updateProduct = async (id, data) => {
  const { name, grade, price, link } = data;

  await db.query(
    "UPDATE product SET name=?, grade=?, price=?, link=? WHERE id=?",
    [name, grade, price, link, id]
  );
};

export const deleteProduct = async (id) => {
  await db.query("DELETE FROM product WHERE id=?", [id]);
};
