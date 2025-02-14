import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";

export let getNotifications = async (req, res) => {
  try {
    let userId = req.user._id;
    // let user = await User.findById(userId);
    // if (!user) {
    //   return res.status(404).json({
    //     error: "user not found ",
    //   });
    // }

    // notifications for me
    let notifications = await Notification.find({ to: userId }).populate({
      path: "from",
      select: "username profileImg",
    });

    await Notification.updateMany({ to: userId }, { read: true }); // read true
    res.status(200).json(notifications);
  } catch (error) {
    console.log("Error occure in the getNotification ", error.message);
    res.status(500).json({
      error: "Internal server Error",
    });
  }
};

export let deleteNotifications = async (req, res) => {
  try {
    let userId = req.user._id;

    await Notification.deleteMany({ to: userId }); // delete my notifications

    res.status(200).json("Notifications deleted successfully");
  } catch (error) {
    console.log("Error occure in the deleteNotification", error.message);
    res.status(500).json({
      error: "Internal server Error",
    });
  }
};

// delte one notification
export let deleteNotification = async (req, res) => {
  try {
    let notificationId = req.params.id;
    let userId = req.user._id;

    let notification = await Notification.findById(notificationId);
    if (!notification) {
      res.status(400).json({
        error: "notificaion does not found ",
      });
    }
    if (notification.to.String() !== userId.toString()) {
      res.status(400).json({
        error: "You are not allowed to delete this notification ",
      });
    }
    await Notification.findByIdAndDelete(notificationId);
    res.status(200).json({
      message: "Notication deleted successfully ",
    });
  } catch (error) {
    console.log("Error in the deleteNOtification controller ", error.message);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};
