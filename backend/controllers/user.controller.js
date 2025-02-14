import User from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";
import Notification from "../models/notification.model.js";
import bcrypt from "bcryptjs";
export let getUserProfile = async (req, res) => {
  let { username } = req.params;
  try {
    let user = await User.findOne({ username }).select("-password"); // not select the password
    if (!user) {
      return res.status(404).json({
        error: "User not found ",
      });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in the getUserProfile", error.message);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export let followUnFollowUser = async (req, res) => {
  try {
    let { id } = req.params;

    let userTomodify = await User.findById(id); // user i want to follow
    let currentUser = await User.findById(req.user._id); // me

    if (id === req.user._id.toString()) {
      // the user i want to follow is myself
      return res
        .status(404)
        .json({ error: "You not follow/unfollow yourself" });
    }

    if (!userTomodify || !currentUser) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    // check for following or not
    let isFollowing = currentUser.following.includes(id); // already follow or not

    if (isFollowing) {
      // already following
      // unfollow here
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } }); // samne wale ka follower jaenga jo ki mai hu req.user._id
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } }); // mere following jaenga unfollow karne k baad
      // retur id of the user as a response
      return res.status(200).json({ message: "User unfollowed successfully" });
      // send notification
    } else {
      // not follow
      // follow here

      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } }); // samne wale ka follower badha  increase the followers of front person
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } }); // add the id of front person in our following
      //send notification to user
      let newNotification = new Notification({
        type: "follow",
        from: currentUser._id,
        to: userTomodify._id,
      });

      await newNotification.save();
      // retur id of the user as a response
      return res.status(200).json({ message: "User followed successfully" });
    }
  } catch (error) {
    console.log("Error in the followUnFollowUser", error.message);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export let getSuggestedUsers = async (req, res) => {
  try {
    let userId = req.user._id;

    let userFollowedByme = await User.findById(userId).select("following");
    if (!userFollowedByme || !userFollowedByme.following) {
      return res
        .status(400)
        .json({ error: "User's following list is empty or not found" });
    }
    console.log("this is the userfollowed by me ", userFollowedByme);

    let users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId },
        },
      },
      {
        $sample: { size: 10 },
      },
    ]);
    // exclude the users followed by me
    let filteredUsers = users.filter((currUser) => {
      return !userFollowedByme.following.includes(currUser._id);
    });

    let suggestedUsers = filteredUsers.slice(0, 4);

    suggestedUsers.forEach((currUser) => {
      currUser.password = null;
    });
    res.status(200).json(suggestedUsers);
  } catch (error) {
    console.log("Error in the suggestedUser", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export let updateUser = async (req, res) => {
  let { username, fullName, email, currentPassword, newPassword, bio, link } =
    req.body;
  let { profileImg, coverImg } = req.body;
  let userId = req.user._id;
  try {
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    if (
      (!currentPassword && newPassword) ||
      (!newPassword && currentPassword)
    ) {
      return res.status(404).json({
        message: "please provide both current and new password ",
      });
    }

    if (currentPassword && newPassword) {
      // for updating password
      // update pass
      let isMatch = bcrypt.compare(currentPassword, user.password); // current password is corrent or not
      if (!isMatch) {
        return res.status(404).json({
          message: "current password is incorrect ",
        });
      }
      if (newPassword.length < 6) {
        return res.status(404).json({
          message: "password must be atleast 6 character long",
        });
      }
      // update password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    // want to update the   profileIm
    if (profileImg) {
      if (user.profileImg) {
        // already a profileImgage  delete that one
        await cloudinary.uploader.destroy(
          user.profileImg.split("/").pop().split(".")[0]
        );
      }

      let uplodedResponse = await cloudinary.uploader.upload(profileImg);
      profileImg = uplodedResponse.secure_url;
    }
    // want to update the   coverImg
    if (coverImg) {
      if (user.coverImg) {
        // already a coverImage  delete that one
        await cloudinary.uploader.destroy(
          user.coverImg.split("/").pop().split(".")[0]
        );
      }
      let uplodedResponse = await cloudinary.uploader.upload(coverImg);
      profileImg = uplodedResponse.secure_url;
    }
    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.profileImg = profileImg || user.profileImg;
    user.coverImg = coverImg || user.coverImg;

    user = await user.save();
    // password is null in the response
    user.password = null;
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in the updateUser", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
