import jwt from "jsonwebtoken";

export let generateTockenAndSetCookie = (userId, res) => {
  let token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  console.log("this is the token", token);

  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, // mili second
    httpOnly: true,
    sameSite: "Strict",
    secure: process.env.NODE_ENV !== "development ",
  });
};
