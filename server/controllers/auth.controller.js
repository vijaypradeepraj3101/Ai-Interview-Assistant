import genToken from "../config/token.js";
import User from "../models/user.model.js";

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const googleAuth = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name: name || "User",
        email,
      });
    } else if (!user.name || user.name.trim() === "") {
      user = await User.findByIdAndUpdate(
        user._id,
        { $set: { name: name || "User" } },
        { new: true }
      );
    }

    const token = await genToken(user._id);

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      success: true,
      user,
      message: "Google authentication successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Google auth error: ${error.message}`,
    });
  }
};

export const logOut = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Logout successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Logout error: ${error.message}`,
    });
  }
};
