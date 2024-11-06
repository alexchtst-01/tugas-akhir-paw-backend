import express from "express";
import { justPostMoney } from "../controller/MoneyController.js";

const MoneyRoutes = express.Router();

MoneyRoutes.post("/money", justPostMoney);

export default MoneyRoutes;
