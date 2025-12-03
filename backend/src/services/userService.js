import { db } from "../config/db.js";

export const getAllUsers = async () => {
  const [rows] = await db.query("SELECT id, username, email FROM user");
  return rows;
};

export const getUserById = async (id) => {
  const [rows] = await db.query(
    "SELECT id, username, email FROM user WHERE id=?",
    [id]
  );
  return rows[0];
};

export const updateUser = async (id, data) => {
  const { username, email } = data;

  await db.query(
    "UPDATE user SET username=?, email=? WHERE id=?",
    [username, email, id]
  );
};

export const deleteUser = async (id) => {
  await db.query("DELETE FROM user WHERE id=?", [id]);
};
