import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";
import ExpanseRoute from "./api/routes/ExpenseRoutes.js";
import MoneyRoutes from "./api/routes/MoneyRoutes.js";
import UserRoutes from "./api/routes/UserRoutes.js";
import AuthenticationRoute from "./api/routes/AuthenticationRoutes.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    origin: [
      "http://localhost:3000",
      "https://penny-bot-fe-brown.vercel.app",
      "https://penny-bot-bqzvn1bti-ryanlukitos-projects.vercel.app",
      "https://penny-bot-fwh29sbgn-ryanlukitos-projects.vercel.app",
      "https://penny-bot-qph0ackws-ryanlukitos-projects.vercel.app",
      "https://penny-bot-c7r1bpxbr-ryanlukitos-projects.vercel.app",
      "https://ambagandalf.site"
    ],
    credentials: true
  })
);
app.use(cookieParser());

app.use(morgan("dev"));

app.use(ExpanseRoute);
app.use(MoneyRoutes);
app.use(UserRoutes);
app.use(AuthenticationRoute);

app.get("/", async (req, res) => {
  try {
    res.send("hallo from backend");
  } catch (error) {
    res.send(error);
  }
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("berhasil connect ke database");
    app.listen(process.env.APP_PORT, () => {
      console.log(`server run in localhost:${process.env.APP_PORT}`);
    });
  } catch (error) {
    console.log("failed to connect to mongodb database");
    process.exit(1);
  }
};

connectDB();
