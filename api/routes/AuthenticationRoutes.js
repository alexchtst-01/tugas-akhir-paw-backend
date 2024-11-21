import express from "express";
import { login, logout, me } from "../controller/AuthenticationController.js";

const AuthenticationRoute = express.Router();

// login routes
AuthenticationRoute.post("/auth/login", login);

// check status login [ME]
AuthenticationRoute.get("/auth/me", me);

// logout
AuthenticationRoute.delete("/auth/logout", logout);

export default AuthenticationRoute;
