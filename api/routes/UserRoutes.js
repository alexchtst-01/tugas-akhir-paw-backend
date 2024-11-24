import express from "express";
import { createUser, updateUser } from "../controller/UserController.js";

const UserRoutes = express.Router();

UserRoutes.post("/register", createUser);
UserRoutes.patch("/user/", updateUser);

export default UserRoutes;
