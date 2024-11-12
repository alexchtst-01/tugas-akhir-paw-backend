import express from "express";

const MoneyRoutes = express.Router();

MoneyRoutes.post("/money");
MoneyRoutes.get("/money/:id");

export default MoneyRoutes;
