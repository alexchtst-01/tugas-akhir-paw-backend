import Expanse from "../model/ExpenseModel.js";
import Money from "../model/MoneyModel.js";

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
  const data = req.body;
  try {
    await Expanse.insertMany(data);
    res.status(200).json({ msg: "bershasil memasukan data" });
  } catch (error) {
    res.status(500).json({ msg: error });
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
      { userID: req.params.id },
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
  const id = req.params.id;
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
