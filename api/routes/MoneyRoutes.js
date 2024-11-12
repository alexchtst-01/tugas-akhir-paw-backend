import express from "express";
import {
  getAccumulativeBalance,
  justPostMoney,
} from "../controller/MoneyController.js";

const MoneyRoutes = express.Router();

MoneyRoutes.post("/money", justPostMoney);
MoneyRoutes.get("/money/:id", getAccumulativeBalance);

export default MoneyRoutes;
