import Comments from "../models/commentModel.js";
import Posts from "../models/postModel.js";
import Users from "../models/User.js";

export const createPost = async (req, res, next) => {
  const { userId, description, image } = req.body;
  try {
    if (!userId || !description) return res.status(400).json({ success: false, message: "User ID and description are required to create a post" });
    const user = await Users.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    const post = await Posts.create({ userId: user._id, description, image });
    res.status(200).json({ success: true, message: "Post created successfully", data: post });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating the post" });
  }
};

export const getPosts = async (req, res, next) => {
  const { userId, profileId } = req.body;
  const { search } = req.query;

  try {
    if (profileId) {
      const profilePosts = await Posts.find({ userId: profileId })
        .populate('userId', 'firstName profession profileUrl');

      res.status(200).json({ success: true, message: "Posts for the specified profile retrieved successfully", data: profilePosts });
    } else {
      const user = await Users.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const friends = user?.friends?.toString().split(",") || [];
      friends.push(userId);

      const searchPostQuery = {
        $or: [
          {
            description: { $regex: search, $options: "i" },
          },
        ],
      };

      const posts = await Posts.find({
        $or: [
          { userId: { $in: friends } },
          { userId: userId },
        ],
        ...(search ? searchPostQuery : {}),
      })
        .populate('userId', 'firstName profession profileUrl')
        .sort({ _id: -1 });

      res.status(200).json({
        success: true,
        message: "Posts retrieved successfully",
        data: posts,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error retrieving posts" });
  }
};

export const getPost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await Posts.findById(id).populate({
      path: "userId",
      select: "firstName lastName location profileUrl -password",
    });
    // .populate({
    //   path: "comments",
    //   populate: {
    //     path: "userId",
    //     select: "firstName lastName location profileUrl -password",
    //   },
    //   options: {
    //     sort: "-_id",
    //   },
    // })
    // .populate({
    //   path: "comments",
    //   populate: {
    //     path: "replies.userId",
    //     select: "firstName lastName location profileUrl -password",
    //   },
    // });

    res.status(200).json({
      sucess: true,
      message: "successfully",
      data: post,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const getUserPost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await Posts.find({ userId: id })
      .populate({
        path: "userId",
        select: "firstName lastName location profileUrl -password",
      })
      .sort({ _id: -1 });

    res.status(200).json({
      sucess: true,
      message: "successfully",
      data: post,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};


export const getComments = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const postComments = await Comments.find({ postId })
      .populate('userId', 'firstName profession profileUrl')
      .populate('replies.userId', 'firstName profession profileUrl')
      .sort({ _id: -1 })

    res.status(200).json({
      success: true,
      message: 'Successfully fetched comments',
      data: postComments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error fetching comments' });
  }
};


export const likePost = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const { id } = req.params;

    const post = await Posts.findById(id);

    const index = post.likes.findIndex((pid) => pid === String(userId));

    if (index === -1) {
      post.likes.push(userId);
    } else {
      post.likes = post.likes.filter((pid) => pid !== String(userId));
    }

    const newPost = await Posts.findByIdAndUpdate(id, post, {
      new: true,
    });

    res.status(200).json({
      sucess: true,
      message: "successfully",
      data: newPost,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const likePostComment = async (req, res, next) => {
  const { userId } = req.body;
  const { id, rid } = req.params;

  try {
    if (rid === undefined || rid === null || rid === `false`) {
      const comment = await Comments.findById(id);

      const index = comment.likes.findIndex((el) => el === String(userId));

      if (index === -1) {
        comment.likes.push(userId);
      } else {
        comment.likes = comment.likes.filter((i) => i !== String(userId));
      }

      const updated = await Comments.findByIdAndUpdate(id, comment, {
        new: true,
      });

      res.status(201).json(updated);
    } else {
      const replyComments = await Comments.findOne(
        { _id: id },
        {
          replies: {
            $elemMatch: {
              _id: rid,
            },
          },
        }
      );

      const index = replyComments?.replies[0]?.likes.findIndex(
        (i) => i === String(userId)
      );

      if (index === -1) {
        replyComments.replies[0].likes.push(userId);
      } else {
        replyComments.replies[0].likes = replyComments.replies[0]?.likes.filter(
          (i) => i !== String(userId)
        );
      }

      const query = { _id: id, "replies._id": rid };

      const updated = {
        $set: {
          "replies.$.likes": replyComments.replies[0].likes,
        },
      };

      const result = await Comments.updateOne(query, updated, { new: true });

      res.status(201).json(result);
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const commentPost = async (req, res, next) => {
  try {
    const { comment, from, userId } = req.body;

    if (!comment || !from) {
      return res.status(400).json({ message: "Comment and from are required fields." });
    }

    const { id } = req.params;

    const newComment = new Comments({ comment, from, userId, postId: id });

    await newComment.save();

    const post = await Posts.findById(id);

    post.comments.push(newComment._id);

    const updatedPost = await Posts.findByIdAndUpdate(id, post, {
      new: true,
    });

    res.status(201).json(newComment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const replyPostComment = async (req, res, next) => {
  const { comment, replyAt, from, userId } = req.body;
  const { id } = req.params;

  if (!comment || !from) {
    return res.status(400).json({ message: "Comment and from are required fields." });
  }

  try {
    const commentInfo = await Comments.findById(id);

    commentInfo.replies.push({
      comment,
      replyAt,
      from,
      userId,
      created_At: Date.now(),
    });

    commentInfo.save();

    res.status(200).json(commentInfo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    await Posts.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

