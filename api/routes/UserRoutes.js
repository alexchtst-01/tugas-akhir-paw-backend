import express from "express";
import { createUser, updateUser } from "../controller/UserController.js";
import { authenticateMe } from "../midleware/AuthClient.js";

const UserRoutes = express.Router();

UserRoutes.post("/register", createUser);
UserRoutes.patch("/user/", authenticateMe, updateUser);

export default UserRoutes;
