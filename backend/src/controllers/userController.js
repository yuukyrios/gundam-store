import * as userService from "../services/userService.js";

export const getUsers = async (req, res, next) => {
  try {
    res.json(await userService.getAllUsers());
  } catch (err) {
    next(err);
  }
};

export const getUser = async (req, res, next) => {
  try {
    res.json(await userService.getUserById(req.params.id));
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    await userService.updateUser(req.params.id, req.body);
    res.json({ message: "User updated" });
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    await userService.deleteUser(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    next(err);
  }
};
