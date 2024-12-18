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
    const token = jwt.sign(data, jwtSecretKey, { expiresIn: "24h" });
    res.cookie("OurSiteJWT", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 10000,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      domain:
        process.env.NODE_ENV === "production"
          ? process.env.FRONTEND_URN
          : "localhost",
    });
    return res.status(200).json({ msg: "berhasil login", token });
  } catch (error) {
    res.status(500).json({ msg: `terjadi error bang ${error}` });
  }
};

export const me = async (req, res) => {
  const { OurSiteJWT } = req.cookies;
  if (!OurSiteJWT) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const jwtSecretKey = process.env.JWT_SECRET_KEY;
  try {
    const decoded = jwt.verify(OurSiteJWT, jwtSecretKey);

    const { userId } = decoded;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Authenticated",
      auth: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (e) {
    // Handle token verification errors
    return res.status(400).json({
      message: "Something went wrong",
      error: e.message,
    });
  }
};

export const logout = async (req, res) => {};
