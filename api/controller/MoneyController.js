import Money from "../model/MoneyModel.js";
import Expanse from "../model/ExpenseModel.js";

const fufufafa = (data) => {
  let res = [];

  data.forEach((element) => {
    if (element.date && !res.includes(element.date)) {
      res.push({ date: element.date, total: 0 });
    }
  });

  data.forEach((element) => {
    if (element.total && element.date) {
      // tambahkan total sesuai bulan
      const target = res.find((item) => item.date == element.date);
      if (target) {
        target.total += element.total;
      }
    }
  });

  return res;
};

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

    // console.log(userMoneyData);
    await console.log(fufufafa(userMoneyData));
    res.status(200).json({
      msg: "data berhasil di retrieve",
      money: userMoneyData,
    });
  } catch (error) {
    res.status(500).json({
      msg: error,
    });
  }
};
