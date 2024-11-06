import Expanse from "../model/ExpenseModel.js";

export const justPostExpanse = async (req, res) => {
  const data = req.body;
  try {
    // const expanse = new Expanse(data);
    // await expanse.save();
    await Expanse.insertMany(data);
    res.status(200).json({msg: "bershasil memasukan data"});
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};
