import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../config/db.js";
import { ResponseError } from "../errors/responseError.js";

export const register = async (data) => {
  const { username, email, password } = data;

  const [exists] = await db.query(
    "SELECT * FROM user WHERE email = ?",
    [email]
  );

  if (exists.length > 0) {
    throw new ResponseError(400, "Email already in use");
  }

  const hashed = await bcrypt.hash(password, 10);

  await db.query(
    "INSERT INTO user (username, email, hashed_password) VALUES (?, ?, ?)",
    [username, email, hashed]
  );

  return { message: "User created" };
};

export const login = async (data) => {
  const { email, password } = data;

  const [rows] = await db.query(
    "SELECT * FROM user WHERE email = ?",
    [email]
  );

  if (rows.length === 0) throw new ResponseError(404, "User not found");

  const user = rows[0];

  const match = await bcrypt.compare(password, user.hashed_password);
  if (!match) throw new ResponseError(401, "Invalid password");

  const token = jwt.sign(
    { id: user.id, email: user.email },
    "SECRET_KEY",
    { expiresIn: "1d" }
  );

  return { token };
};
