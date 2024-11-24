import Money from "../model/MoneyModel.js";
import Expanse from "../model/ExpenseModel.js";

export const createMoneyTrack = async (req, res) => {
  try {
    const userID = req.userId;
    const { income } = req.body;
    const existData = await Money.findOne({ userID: userID });
    income = parseFloat(income);
    if (income) {
      existData.total_income = income;
    }
    await existData.save({ new: false });
    return res.status(200).json({ msg: "income berhasil dimasukan" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};
