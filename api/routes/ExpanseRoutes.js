import express from "express";
import { justPostExpanse } from "../controller/ExpanseController.js";

const ExpanseRoute = express.Router();

ExpanseRoute.post("/expense", justPostExpanse);

export default ExpanseRoute;
