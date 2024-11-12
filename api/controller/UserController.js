import User from "../model/UserModel.js";

export const createUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const existUser = await User.findOne({
      email: email,
    });
    console.log(existUser);
    if (existUser)
      return res.status(500).json({ msg: "email sudah pernah dipakai" });
    const user = new User({
      name: name,
      email: email,
      phone: phone,
      password: password,
    });
    await user.save();
    res.status(200).json({ msg: "user berhasil dibuat" });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

export const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, email, phone, password } = req.body;
    const existUser = await User.find({
      email: email,
    });
    if (!existUser)
      return res.status(500).json({ msg: "email sudah pernah dipakai" });
    await User.findByIdAndUpdate(
      { id },
      { name, email, phone, password },
      { new: true }
    );
    return res.status(200).json({ msg: "user berhasil di update" });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};
