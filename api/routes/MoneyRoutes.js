import express from "express";
import { createMoneyTrack } from "../controller/MoneyController.js";
import { authenticateMe } from "../midleware/AuthClient.js";

const MoneyRoutes = express.Router();

MoneyRoutes.post("/money", authenticateMe, createMoneyTrack);
MoneyRoutes.get("/money/:id");

export default MoneyRoutes;
