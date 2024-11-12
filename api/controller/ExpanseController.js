import Expanse from "../model/ExpenseModel.js";
import Money from "../model/MoneyModel.js";

export const justPostExpanse = async (req, res) => {
  const data = req.body;
  try {
    await Expanse.insertMany(data);
    res.status(200).json({ msg: "bershasil memasukan data" });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};
