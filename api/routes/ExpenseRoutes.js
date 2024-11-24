import express from "express";
import {
  createExpense,
  getAllDetailedExpense,
  getDetailedExpenseByCategory,
  getSummaryExpense,
  updateExpanse,
} from "../controller/ExpanseController.js";
import { authenticateMe } from "../midleware/AuthClient.js";

const ExpenseRoute = express.Router();

ExpenseRoute.post("/expense", authenticateMe, createExpense);
ExpenseRoute.get("/expense/summary", authenticateMe, getSummaryExpense);
ExpenseRoute.get("/expense/detail", authenticateMe, getAllDetailedExpense);
ExpenseRoute.get(
  "/expense/:id/:category",
  authenticateMe,
  getDetailedExpenseByCategory
);

ExpenseRoute.patch(
  "/expense/:id",
  authenticateMe,
  updateExpanse
);

export default ExpenseRoute;
