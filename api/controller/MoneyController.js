import Money from "../model/MoneyModel.js";
import Expanse from "../model/ExpenseModel.js";

export const createMoneyTrack = async (req, res) => {
  const data = req.body;
  try {
    await Money.insertMany(data);
    res.status(200).json({ msg: "berhasil memasukan data" });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

export const editMoney = async (req, res) => {
  try {
    const userID = req.params.id;
    const { income } = req.body;
    const existData = await Money.find({ userID: userID });
    if (income) {
      existData.income = income;
    }
    existData.save();
    return req.status(200).json({ msg: "income berhasil dimasukan" });
  } catch (error) {
    return res.status(500).json({ msg: error });
  }
};
