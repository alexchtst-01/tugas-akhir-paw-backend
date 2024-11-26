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

const UploadToDrive = async (fileBuffer) => {
  try {
    const bufferStream = new stream.PassThrough();
    bufferStream.end(fileBuffer.buffer);

    const drive = google.drive({ version: "v3", auth });

    const response = await drive.files.create({
      requestBody: {
        name: fileBuffer.originalname, // Use the original name of the file
      },
      media: {
        mimeType: fileBuffer.mimetype,
        body: bufferStream,
      },
    });

    console.log("File uploaded to Google Drive:", response.data);

    // Set permissions to make the file publicly accessible
    await drive.permissions.create({
      fileId: response.data.id,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    const publicUrl = `https://drive.google.com/uc?id=${response.data.id}`;
    return publicUrl;
  } catch (error) {
    console.error("Failed to upload file:", error);
    throw error;
  }
};

// the old one
// const uploadImage = async (imgPath) => {
//   const drive = google.drive({ version: "v3", auth });
//   const folderID = process.env.DRIVE_FOLDER_ID;

//   try {
//     const mimeType = mime.getType(imgPath)
//     const response = await drive.files.create({
//       requestBody: {
//         name: path.basename(imgPath),
//         parents: folderID ? [folderID] : [],
//       },
//       media: {
//         mimeType: mimeType,
//         body: fs.createReadStream(imgPath),
//       },
//     });

//     const fileId = response.data.id;
//     console.log("File uploaded successfully!");

//     // Set the file to be publicly accessible
//     await drive.permissions.create({
//       fileId: fileId,
//       requestBody: {
//         role: "reader",
//         type: "anyone",
//       },
//     });

//     const publicUrl = `https://drive.google.com/uc?id=${fileId}`;
//     // console.log("Public URL of the file:", publicUrl);
//     return publicUrl;
//   } catch (error) {
//     return "https://drive.google.com/uc?id=16C_q8KU5FrKpk0erHdIJkKfSGQqdRozN";
//   }
// };

function fufufafaSummary(data) {
  const temp = {};
  const monthNames = {
    Januari: "January",
    Februari: "February",
    Maret: "March",
    April: "April",
    Mei: "May",
    Juni: "June",
    Juli: "July",
    Agustus: "August",
    September: "September",
    Oktober: "October",
    November: "November",
    Desember: "December",
  };

  for (let item of data) {
    let dateStr = item.date;

    // Replace Indonesian month names with English equivalents
    for (const [ind, eng] of Object.entries(monthNames)) {
      dateStr = dateStr.replace(ind, eng);
    }

    let dateObj;
    // Handle specific formats manually
    if (/\d{2}-\d{2}-\d{4}/.test(dateStr)) {
      const [day, month, year] = dateStr.split("-");
      dateObj = new Date(`${year}-${month}-${day}`);
    } else {
      dateObj = new Date(dateStr);
    }

    if (isNaN(dateObj)) {
      console.error(`Invalid date: ${item.date}`);
      continue; // Skip invalid dates
    }

    const year = dateObj.getFullYear();
    const month = dateObj.toLocaleString("en-US", { month: "long" });
    const key = `${year}-${month}`;

    if (!temp[key]) {
      temp[key] = item.total;
    } else {
      temp[key] += item.total;
    }
  }

  return temp;
}

function fufufafaCategory(data) {
  let temp = {};

  for (let item of data) {
    // Initialize category if not present
    if (!temp[item.category]) {
      temp[item.category] = 0;
    }

    // Add total only if not reimbursed
    if (!item.reimbuse) {
      temp[item.category] += item.total;
    }
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

function fufufafaPercentage(money, data) {
  const totalExpanse = fufufafaMoney(money).total_expanse;
  const categoryExpanse = fufufafaCategory(data);
  let temp = []; // Initialize as an array to store result objects

  if (totalExpanse === 0) {
    console.warn("Total expense is zero. Cannot calculate percentages.");
    return temp; // Return empty array if totalExpanse is zero
  }

  // Calculate percentage for each category and prepare the result
  for (let category in categoryExpanse) {
    const percentage = (
      (categoryExpanse[category] / totalExpanse) *
      100
    ).toFixed(2);
    const amount = categoryExpanse[category]; // The actual amount for the category

    // Create the object with name, percentage, and amount
    temp.push({
      name: category.charAt(0).toUpperCase() + category.slice(1), // Capitalize first letter
      percentage: parseFloat(percentage), // Convert percentage to number
      amount: amount, // The amount (no formatting needed here)
    });
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
  } = req.body;

  if (!subject || !merchant || !date || !total || !payment_method) {
    return res.status(400).json({
      msg: `Missing required fields either subject merchant date total or payment method`,
    });
  }

  const userMoney = await Money.findOne({ userID: req.userId });
  const expenseTotal = parseFloat(total);

  const { files } = req;

  try {
    let imageUrl;

    // Handle file upload if an image is provided
    if (req.file) {
      imageUrl = await UploadToDrive(files[0]);
    }

    // Create expense in the database
    await Expanse.create({
      subject,
      merchant,
      date,
      total: expenseTotal,
      reimbuse,
      category,
      description,
      payment_method,
      invoice: imageUrl,
      userID: req.userId,
    });

    // Update user's financial data
    userMoney.total_expanse += expenseTotal;
    userMoney.balance -= expenseTotal;
    await userMoney.save();

    res.status(200).json({ msg: "Successfully added expense data" });
  } catch (error) {
    console.error("Error creating expense:", error);
    res.status(500).json({ msg: error.message || "An unknown error occurred" });
  }
};

// the old one
// export const createExpense = async (req, res) => {
//   let {
//     subject,
//     merchant,
//     date,
//     total,
//     reimbuse,
//     category,
//     description,
//     payment_method,
//     invoice,
//   } = req.body;

//   // Ensure required fields are present
//   if (!subject || !merchant || !date || !total || !payment_method) {
//     return res.status(400).json({ msg: "Missing required fields" });
//   }

//   const userMoney = await Money.findOne({ userID: req.userId });
//   total = parseFloat(total);

//   try {
//     let imageUrl = "";

//     // If an image is uploaded, process and upload to Google Drive
//     if (req.file) {
//       const localPath = req.file.path;

//       // Upload to Google Drive and get the public URL
//       imageUrl = await uploadImage(localPath);

//       // Optionally delete the local file after uploading
//       fs.unlinkSync(localPath);
//     }

//     // Create the expense in the database
//     await Expanse.create({
//       subject,
//       merchant,
//       date,
//       total,
//       reimbuse,
//       category,
//       description,
//       payment_method,
//       imagePath: imageUrl, // Store the Google Drive URL
//       invoice,
//       userID: req.userId,
//     });

//     // Update user's financial data
//     userMoney.total_expanse += total;
//     userMoney.balance -= total;
//     await userMoney.save({ new: false });

//     res.status(200).json({ msg: "Successfully added expense data" });
//   } catch (error) {
//     console.error("Error creating expense:", error);
//     res.status(500).json({ msg: error.message || "An unknown error occurred" });
//   }
// };

export const getSummaryExpense = async (req, res) => {
  const id = req.userId;
  try {
    const expanse = await Expanse.find({ userID: id });
    const userMoney = await Money.find(
      { userID: req.userId },
      "balance total_income total_expanse userID"
    );

    // console.log(expanse);

    const summary = fufufafaSummary(expanse);
    const accMoney = fufufafaMoney(userMoney);
    const category = fufufafaCategory(expanse);
    const percentage = fufufafaPercentage(userMoney, expanse);

    res.status(200).json({
      msg: "data berhasil di retrieve",
      money: accMoney,
      summary: summary,
      budget: category,
      percentage: percentage,
      // expanse: expanse,
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

export const updateExpanse = async (req, res) => {
  try {
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

    const expenseId = req.params.id;

    // Fetch the existing expense and user's money record
    const existExpense = await Expanse.findOne({ _id: expenseId });
    if (!existExpense) {
      return res.status(404).json({ msg: "Expense not found" });
    }

    const money = await Money.findOne({ userID: req.userId });
    if (!money) {
      return res.status(404).json({ msg: "User's money record not found" });
    }

    // Calculate balance and expenses adjustments
    const currentTotal = parseFloat(existExpense.total);
    const newTotal = parseFloat(total);
    if (isNaN(newTotal) || newTotal < 0) {
      return res.status(400).json({ msg: "Invalid total value" });
    }

    // Update user's balance and total expenses
    money.balance += newTotal - currentTotal;
    money.total_expanse += newTotal - currentTotal;

    // Update the expense fields
    if (subject) existExpense.subject = subject;
    if (merchant) existExpense.merchant = merchant;
    if (date) existExpense.date = date;
    if (reimbuse) existExpense.reimbuse = reimbuse;
    if (category) existExpense.category = category;
    if (description) existExpense.description = description;
    if (payment_method) existExpense.payment_method = payment_method;
    if (invoice) existExpense.invoice = invoice;
    if (imagePath) existExpense.imagePath = imagePath;
    existExpense.total = newTotal;

    // Save the updated records
    await existExpense.save({ new: false });
    await money.save({ new: false });

    return res.status(200).json({ msg: "Expense updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: `An error occurred: ${error.message}` });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const prodId = req.params.id;
    const userId = req.userId;
    // console.log(prodId, userId)
    const existExpense = await Expanse.findOne({
      _id: prodId,
      userID: userId,
    });
    // console.log(existExpense)
    if (!existExpense)
      return res.status(404).json({ msg: "data tidak ditemukan" });
    const money = parseFloat(existExpense.total);
    const existMoney = await Money.findOne({
      userID: userId,
    });
    existMoney.balance += money;
    existMoney.total_expanse -= money;
    await existMoney.save({ new: false });
    await Expanse.deleteOne({
      _id: prodId,
      userID: userId,
    });
    res.status(200).json({ msg: "data berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ msg: `terjadi kesalahan ${error.message}` });
  }
};
