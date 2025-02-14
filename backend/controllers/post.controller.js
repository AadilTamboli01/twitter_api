import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import { v2 as cloudinary } from "cloudinary";
import Notification from "../models/notification.model.js";

export let createPost = async (req, res) => {
  try {
    let { text } = req.body;
    let { img } = req.body;
    let userId = req.user._id;

    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    if (!text && !img) {
      return res.status(404).json({
        error: "Post must have text or image",
      });
    }

    if (img) {
      let uploadResponse = await cloudinary.uploader.upload(img);
      img = uploadResponse.secure_url;
    }

    let newPost = new Post({
      user: userId,
      text: text,
      img: img,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.log("Error in the createPost", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export let deletePost = async (req, res) => {
  try {
    let { id } = req.params;
    let post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        error: "Post not found",
      });
    }
    if (post.user.toString() !== req.user._id.toString()) {
      res.status(401).json({
        error: "you are not authorized to delete this post ",
      });
    }

    if (post.img) {
      // delete image
      let imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }
    // delete post
    await Post.findByIdAndDelete(id);
    res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.log("Error in the delete Post", error.message);
    res.status(500).json({
      error: "internal server error",
    });
  }
};

export let commentOnPost = async (req, res) => {
  try {
    let { text } = req.body;
    let postId = req.params.id;
    let userId = req.user._id;

    if (!text) {
      return res.status(404).json({
        error: "textfield is required",
      });
    }
    let post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        error: "post not found",
      });
    }
    let comment = { user: userId, text: text };

    post.comments.push(comment);
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    console.log("Error in the commentonPost ", error.message);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export let likeUnlikePost = async (req, res) => {
  try {
    let userId = req.user._id;
    let { id: postId } = req.params;

    let post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        error: "Post not found",
      });
    }
    let userLikedPost = post.likes.includes(userId); // already liked

    // if already liked then unliked else like
    if (!userLikedPost) {
      // not like
      // like here
      await Post.updateOne({ _id: postId }, { $push: { likes: userId } });
      await User.updateOne({ _id: userId }, { $push: { likedPost: postId } });
      await post.save();
      let notification = new Notification({
        from: userId,
        to: post.user,
        type: "like",
      });
      await notification.save();
      res.status(200).json("post liked successfully");
    } else {
      // unlike here
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      await User.updateOne({ _id: userId }, { $pull: { likedPost: postId } });
      res.status(200).json("post unliked successfully");
    }
  } catch (error) {
    console.log("Error in the likedunlike ", error.message);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export let getAllPosts = async (req, res) => {
  try {
    let posts = await Post.find()
      .sort({ cretedAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    if (posts.length == 0) {
      return res.status(200).json([]); // no posts available
    }
    res.status(200).json(posts);
  } catch (error) {
    console.log("Error in the getAllPosts", error.message);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export let getLikedPost = async (req, res) => {
  try {
    let userId = req.params.id;
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    // all likedposts
    let likedPost = await Post.find({ _id: { $in: user.likedPost } })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    res.status(200).json(likedPost);
  } catch (error) {
    console.log("Error in the getLikedPost", error.message);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export let getFollowing = async (req, res) => {
  try {
    let userId = req.user._id;
    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    let followingPeople = user.following;

    let feedPosts = await Post.find(
      { user: { $in: followingPeople } } // all peoples i follow in feed post
    )
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    console.log(feedPosts, "thisi the feedposts ");
    res.status(200).json(feedPosts);
  } catch (error) {
    console.log("Error in the getFollowing", error.message);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export let getUsersPosts = async (req, res) => {
  try {
    let { username } = req.params;
    let user = await User.findOne({ username: username });
    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    // posts of the user
    let posts = await Post.find({ user: user._id })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });
    res.status(200).json(posts);
  } catch (error) {
    console.log("Error in the getUsersPosts", error.message);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};
