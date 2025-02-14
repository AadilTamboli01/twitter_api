import User from "../models/user.model.js";
import { generateTockenAndSetCookie } from "../lib/utils/generateToken.js";
import bcrypt from "bcryptjs";

export let signup = async (req, res) => {
  try {
    let { fullName, username, email, password } = req.body;

    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    let existingUser = await User.findOne({ username }); // single for same name as field
    if (existingUser) {
      return res.status(400).json({ error: "Username is already taken" });
    }

    let existingEmail = await User.findOne({ email }); // single for same name as field
    if (existingEmail) {
      return res.status(400).json({ error: "Email is already taken" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "The password must be atleast 6 character long" });
    }

    // hashPassword
    let salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(password, salt);

    let newUser = new User({
      fullName: fullName,
      email: email,
      password: hashedPassword,
      username: username,
    });

    if (newUser) {
      generateTockenAndSetCookie(newUser._id, res);
      await newUser.save();

      return res.status(201).json({
        id: newUser._id,
        usernaname: newUser.username,
        email: newUser.email,
        password: newUser.password,
        followers: newUser.followers,
        following: newUser.following,
        profileImg: newUser.profileImg,
        coverImg: newUser.converImg,
      });
      // res.status(201).json({ message: "New user created successfully" });
    } else {
      return res.status(400).json({
        error: "Invalid user data",
      });
    }
  } catch (error) {
    console.log("Error in signup controllers! ", error.message);
    return res.status(500).json({ error: "Internal server error " });
  }
};

export let login = async (req, res) => {
  try {
    let { username, password } = req.body;
    let user = await User.findOne({ username });
    // check is valid password or not
    let isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({
        error: "Invalid username or password",
      });
    }

    // if the true user then again generate the cookie for the session
    generateTockenAndSetCookie(user._id, res);

    res.status(200).json({
      id: user._id,
      usernaname: user.username,
      email: user.email,
      password: user.password,
      followers: user.followers,
      following: user.following,
      profileImg: user.profileImg,
      coverImg: user.converImg,
    });
  } catch (error) {
    console.log("Error in login controllers! ", error.message);
    return res.status(500).json({ error: "Internal server error " });
  }
};

export let logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 }); // for immidietly kill it
    res.status(200).json({
      message: "Logged out successfylly ! ",
    });
  } catch (error) {
    console.log("Error in logout controllers! ", error.message);
    return res.status(500).json({ error: "Internal server error " });
  }
};

export let getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
     return res.status(200).json(user);
  } catch (error) {
    console.log("Error is getMe controller".error.message);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
