import User from "../model/UserModel.js";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  const { username, password } = req.body;
  let user;
  const jwtSecretKey = process.env.JWT_SECRET_KEY;
  try {
    if (username.includes("@") && username.includes(".com")) {
      user = await User.findOne({ email: username });
    } else if (Number(username)) {
      user = await User.findOne({ phone: username });
    } else {
      return res.status(403).json({ msg: `invalid field untuk ${username}` });
    }
    if (!user)
      return res
        .status(404)
        .json({ msg: `user dengan username ${username} tidak ditemukan` });
    if (user.password !== password)
      return res.status(403).json({ msg: `password yang anda masukan salah` });
    let data = {
      date: Date.now(),
      userId: user._id,
      name: user.name,
    };
    // kalo berhasil login
    const token = jwt.sign(data, jwtSecretKey, { expiresIn: "5m" });
    res.cookie("_vercel_jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 5 * 60 * 1000,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      domain:
        process.env.NODE_ENV === "production"
          ? process.env.FRONTEND_URN
          : "localhost",
    });
    return res.status(200).json({ msg: "berhasil login", token });
  } catch (error) {
    res.status(500).json({ msg: `terjadi error ${error}` });
  }
};

export const me = async (req, res) => {};

export const logout = async (req, res) => {};
