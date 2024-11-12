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
