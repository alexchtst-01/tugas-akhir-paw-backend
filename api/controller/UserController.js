import User from "../model/UserModel.js";

export const postData = async (req, res) => {
  try {
    const data = req.body;
    const user = new User(data);
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};
