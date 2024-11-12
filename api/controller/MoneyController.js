import Money from "../model/MoneyModel.js";
import Expanse from "../model/ExpenseModel.js";

function fufufafa(data) {
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
  const result = Object.keys(temp).map((time) => ({
    date: time,
    totalMoney: temp[time],
  }));
  return result;
}

export const justPostMoney = async (req, res) => {
  const data = req.body;
  try {
    await Money.insertMany(data);
    res.status(200).json({ msg: "berhasil memasukan data" });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

export const getAccumulativeBalance = async (req, res) => {
  const id = req.params.id;
  try {
    const userMoneyData = await Expanse.find({ userID: id }, "total date");

    const accumulative = await fufufafa(userMoneyData);
    res.status(200).json({
      msg: "data berhasil di retrieve",
      money: userMoneyData,
      acc: accumulative,
    });
  } catch (error) {
    res.status(500).json({
      msg: error,
    });
  }
};
