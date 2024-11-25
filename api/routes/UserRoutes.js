import express from "express";
import {
  createUser,
  getUser,
  updateUser,
} from "../controller/UserController.js";
import { authenticateMe } from "../midleware/AuthClient.js";

const UserRoutes = express.Router();

UserRoutes.post("/register", createUser);
UserRoutes.patch("/user/", authenticateMe, updateUser);
UserRoutes.get("/user", authenticateMe, getUser);

export default UserRoutes;
