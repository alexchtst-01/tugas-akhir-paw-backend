import express from "express";
import multer from "multer"
import path from "path";
import fs from "fs"
import {
  createExpense,
  deleteExpense,
  getAllDetailedExpense,
  getDetailedExpenseByCategory,
  getSingleItembyId,
  getSummaryExpense,
  updateExpanse,
} from "../controller/ExpanseController.js";
import { authenticateMe } from "../midleware/AuthClient.js";

const ExpenseRoute = express.Router();

const upload = multer();

ExpenseRoute.post("/expense", authenticateMe, upload.any(), createExpense);
ExpenseRoute.get("/expense/summary", authenticateMe, getSummaryExpense);
ExpenseRoute.get("/expense/detail", authenticateMe, getAllDetailedExpense);
ExpenseRoute.get(
  "/expense/:id/:category",
  authenticateMe,
  getDetailedExpenseByCategory
);

ExpenseRoute.patch("/expense", authenticateMe, updateExpanse);
ExpenseRoute.delete("/expense/:id", authenticateMe, deleteExpense);
ExpenseRoute.get("/expense/:id", authenticateMe, getSingleItembyId);

export default ExpenseRoute;
