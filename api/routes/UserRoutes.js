import express from "express";
import { postData } from "../controller/UserController.js";

const UserRoutes = express.Router()

UserRoutes.post('/', postData)

export default UserRoutes;