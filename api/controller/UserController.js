import Money from "../model/MoneyModel.js";
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
    const money = new Money({
      userID: user._id,
    });
    await money.save();
    res
      .status(200)
      .json({ msg: "user berhasil dibuat dengan data money kosong" });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

export const updateUser = async (req, res) => {
  try {
    const id = req.userId;
    const {
      name,
      firstname,
      lastname,
      address,
      citycountry,
      occupation,
      nationality,
    } = req.body;
    const existUser = await User.findOne({
      _id: id,
    });
    if (!existUser)
      return res.status(404).json({ msg: "user tidak ditemukan" });
    if (name) {
      existUser.name = name;
    }
    if (firstname) {
      existUser.firstname = firstname;
    }
    if (lastname) {
      existUser.lastname = lastname;
    }
    if (address) {
      existUser.address = address;
    }
    if (citycountry) {
      existUser.citycountry = citycountry;
    }
    if (occupation) {
      existUser.occupation = occupation;
    }
    if (nationality) {
      existUser.nationality = nationality;
    }
    await existUser.save({ new: false });
    return res.status(200).json({ msg: "user berhasil di update" });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};
