import express from "express";
import multer from "multer"
import path from "path";
import fs from "fs"
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

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// const storage = multer.memoryStorage();
// const upload = multer({ storage });

ExpenseRoute.post("/expense",  upload.single("invoiceFile"), createExpense);
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
