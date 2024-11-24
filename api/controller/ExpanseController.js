import Expanse from "../model/ExpenseModel.js";
import Money from "../model/MoneyModel.js";
import { google } from "googleapis";
import fs from "fs";
import path from "path";
import mime from "mime";
import dotenv from "dotenv";

dotenv.config();

const SCOPES = ["https://www.googleapis.com/auth/drive"];

const auth = new google.auth.GoogleAuth({
  credentials: {
    type: process.env.GOOGLE_TYPE,
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_CLIENT_ID,
    auth_uri: process.env.GOOGLE_AUTH_URI,
    token_uri: process.env.GOOGLE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL,
  },
  scopes: SCOPES,
});

const uploadImage = async (imgPath) => {
  const drive = google.drive({ version: "v3", auth });
  const folderID = process.env.DRIVE_FOLDER_ID;

  try {
    const mimeType = mime.getType(imgPath) || "application/octet-stream";
    ``;
    const response = await drive.files.create({
      requestBody: {
        name: path.basename(imgPath),
        parents: folderID ? [folderID] : [],
      },
      media: {
        mimeType: mimeType,
        body: fs.createReadStream(imgPath),
      },
    });

    const fileId = response.data.id;
    console.log("File uploaded successfully!");

    // Set the file to be publicly accessible
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    const publicUrl = `https://drive.google.com/uc?id=${fileId}`;
    // console.log("Public URL of the file:", publicUrl);
    return publicUrl;
  } catch (error) {
    // console.error("Error uploading file:", error.message);
    return "https://drive.google.com/uc?id=16C_q8KU5FrKpk0erHdIJkKfSGQqdRozN";
  }
};

function fufufafaSummary(data) {
  let temp = {};

  for (let item of data) {
    const dateObj = new Date(item.date);
    const year = dateObj.getFullYear().toString();
    const month = (dateObj.getMonth() + 1).toString();
    const time = `${year}-${month}`;

    if (!temp[time]) {
      temp[time] = item.total;
    } else {
      temp[time] += item.total;
    }
  }
  return temp;
}

function fufufafaCategory(data) {
  let temp = {};

  for (let item of data) {
    // kalo ada reimbuse jadi nol aja kan di balikin uangnya
    if (!temp[item.category]) {
      if (item.reimbuse) {
        temp[item.category] = 0;
      } else {
        temp[item.category] = item.total;
      }
    } else {
      if (item.reimbuse) {
        temp[item.category] += 0;
      } else {
        temp[item.category] += item.total;
      }
    }
  }

  if (Object.keys(temp).length === 0) {
    temp["food"] = 0;
    temp["transportation"] = 0;
    temp["electricity"] = 0;
  }
  return temp;
}

function fufufafaMoney(data) {
  let temp = {
    total_balance: 0,
    total_income: 0,
    total_expanse: 0,
  };
  for (let item of data) {
    temp["total_balance"] += item.balance;
    temp["total_income"] += item.total_income;
    temp["total_expanse"] += item.total_expanse;
  }

  return temp;
}

export const createExpense = async (req, res) => {
  const {
    subject,
    merchant,
    date,
    total,
    reimbuse,
    category,
    description,
    payment_method,
    invoice,
    imagePath,
  } = req.body;

  // Validate input
  if (!subject || !merchant || !date || !total || !payment_method) {
    return res.status(400).json({ msg: "Missing required fields" });
  }

  console.log(req.userId);

  try {
    await Expanse.create({
      subject,
      merchant,
      date,
      total,
      reimbuse,
      category,
      description,
      payment_method,
      imagePath,
      invoice,
      userID: req.userId,
    });

    res.status(200).json({ msg: "Successfully added expense data" });
  } catch (error) {
    console.error("Error creating expense:", error);
    res.status(500).json({ msg: error.message || "An unknown error occurred" });
  }
};

export const getSummaryExpense = async (req, res) => {
  const id = req.params.id;
  try {
    const expanse = await Expanse.find(
      { userID: id }
      // "total date category reimbuse"
    );
    const userMoney = await Money.find(
      { userID: req.userId },
      "balance total_income total_expanse userID"
    );

    const summary = await fufufafaSummary(expanse);
    const accMoney = await fufufafaMoney(userMoney);
    const category = await fufufafaCategory(expanse);

    res.status(200).json({
      msg: "data berhasil di retrieve",
      money: accMoney,
      summary: summary,
      budget: category,
      // expanse: expanse
    });
  } catch (error) {
    res.status(500).json({
      msg: error,
    });
  }
};

// udah gw sorting nih pak dari paling baru ke paling lama
export const getAllDetailedExpense = async (req, res) => {
  const id = req.userId;
  try {
    const expanse = await Expanse.find(
      { userID: id },
      "subject merchant date category total payment_method reimbuse description"
    ).sort({ date: -1 });
    res.status(200).json(expanse);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

// udah gw sorting nih pak dari paling baru ke paling lama
export const getDetailedExpenseByCategory = async (req, res) => {
  const id = req.params.id;
  const category = req.params.category;
  try {
    // udah gw sorting nih pak dari paling baru ke paling lama
    const expanse = await Expanse.find(
      { userID: id, category: category },
      "subject merchant date category total payment_method reimbuse description"
    ).sort({ date: -1 });
    res.status(200).json(expanse);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};
