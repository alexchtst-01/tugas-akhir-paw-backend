import express from "express";
import {
  createExpense,
  getAllDetailedExpense,
  getDetailedExpenseByCategory,
  getSummaryExpense,
} from "../controller/ExpanseController.js";

const ExpenseRoute = express.Router();

ExpenseRoute.post("/expense/:id", createExpense);
ExpenseRoute.get("/expense/summary/:id", getSummaryExpense);
ExpenseRoute.get("/expense/:id", getAllDetailedExpense);
ExpenseRoute.get("/expense/:id/:category", getDetailedExpenseByCategory);

export default ExpenseRoute;
