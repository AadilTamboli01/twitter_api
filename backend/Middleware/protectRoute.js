import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
export let protectRoute = async (req, res, next) => {
  try {
    let token = req.cookies.jwt;
    if (!token) {
      // not exist cookie
      return res.status(401).json({
        error: "you need to login first",
      });
    }

    console.log("this is token ", token);

    let decode = jwt.verify(token, process.env.JWT_SECRET);

    if (!decode) {
      return res.status(401).json({
        error: "Invalid token",
      });
    }

    let user = await User.findById(decode.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("Error in the protectedRou catch ", error.message);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};
