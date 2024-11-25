import express from "express";
import multer from "multer"
import {
  createExpense,
  deleteExpense,
  getAllDetailedExpense,
  getDetailedExpenseByCategory,
  getSummaryExpense,
  updateExpanse,
} from "../controller/ExpanseController.js";
import { authenticateMe } from "../midleware/AuthClient.js";

const ExpenseRoute = express.Router();

const upload = multer({dist: "/dist"});

ExpenseRoute.post("/expense", authenticateMe, upload.single("image"), createExpense);
ExpenseRoute.get("/expense/summary", authenticateMe, getSummaryExpense);
ExpenseRoute.get("/expense/detail", authenticateMe, getAllDetailedExpense);
ExpenseRoute.get(
  "/expense/:id/:category",
  authenticateMe,
  getDetailedExpenseByCategory
);
ExpenseRoute.patch("/expense", authenticateMe, updateExpanse);
ExpenseRoute.delete("/expense/:id", authenticateMe, deleteExpense);

export default ExpenseRoute;
