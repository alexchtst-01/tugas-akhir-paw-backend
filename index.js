import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "*",
  })
);

app.use(morgan("dev"));

app.use(express.json());

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
