import User from '../models/User.js'
import FriendRequest from '../models/friendRquest.js'
import jwt from 'jsonwebtoken'

// GET USER
export const getUser = async (req, res, next) => {
    const id = req.params.id;
    console.log(id)
    try {
        const user = await User.findById(id)
        // .populate({
        //     path: "friends",
        //     select: "-password",
        // });

        if (!user) {
            return res.status(200).send({
                message: "User Not Found",
                success: false,
            });
        }

        user.password = undefined;

        res.status(200).json({
            success: true,
            user: user,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "auth error",
            success: false,
            error: error.message,
        });
    }
};

// UPDATE USER
export const updateUser = async (req, res, next) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(updatedUser);
    } catch (error) {
        next(error);
    }
};

// FRIEND REQUEST
export const friendRequest = async (req, res, next) => {
    try {
        const { userId } = req.body;

        const { requestTo } = req.body;

        const requestExist = await FriendRequest.findOne({
            requestFrom: userId,
            requestTo,
        });

        if (requestExist) {
            next("Friend Request already sent.");
            return;
        }

        const accountExist = await FriendRequest.findOne({
            requestFrom: requestTo,
            requestTo: userId,
        });

        if (accountExist) {
            next("Friend Request already sent.");
            return;
        }

        const newRes = await FriendRequest.create({
            requestTo,
            requestFrom: userId,
        });

        res.status(201).json({
            success: true,
            message: "Friend Request sent successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "auth error",
            success: false,
            error: error.message,
        });
    }
};

// GET FRIEND REQUEST
export const getFriendRequest = async (req, res) => {
    try {
        const { userId } = req.body;

        const request = await FriendRequest.find({
            requestTo: userId,
            requestStatus: "Pending",
        })
            // .populate({
            //     path: "requestFrom",
            //     select: "firstName lastName profileUrl profession -password",
            // })
            .limit(10)
            .sort({
                _id: -1,
            });

        res.status(200).json({
            success: true,
            data: request,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "auth error",
            success: false,
            error: error.message,
        });
    }
};
// ACCEPT REQUEST
export const acceptRequest = async (req, res, next) => {    
    try {        
        const { rid, status , userId } = req.body;

        const requestExist = await FriendRequest.findById(rid);

        if (!requestExist) {
            next("No Friend Request Found.");
            return;
        }

        const newRes = await FriendRequest.findByIdAndUpdate(
            { _id: rid },
            { requestStatus: status }
        );

        if (status === "Accepted") {
            const user = await User.findById(userId);

            user.friends.push(newRes?.requestFrom);

            await user.save();

            const friend = await User.findById(newRes?.requestFrom);

            friend.friends.push(newRes?.requestTo);

            await friend.save();
        }

        res.status(201).json({
            success: true,
            message: "Friend Request " + status,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "auth error",
            success: false,
            error: error.message,
        });
    }
};
// PROFILE VIEwS
export const profileViews = async (req, res, next) => {
    try {
        const { userId } = req.body.user;
        const { id } = req.body;

        const user = await User.findById(id);

        user.views.push(userId);

        await user.save();

        res.status(201).json({
            success: true,
            message: "Successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "auth error",
            success: false,
            error: error.message,
        });
    }
};
// SUGGESTED FRIENDS
export const suggestedFriends = async (req, res) => {
    try {
        const { userId } = req.body;

        let queryObject = {};

        queryObject._id = { $ne: userId };

        queryObject.friends = { $nin: userId };

        let queryResult = User.find(queryObject)
            .limit(15)
            .select("firstName lastName profileUrl profession -password");

        const suggestedFriends = await queryResult;

        res.status(200).json({
            success: true,
            data: suggestedFriends,
        });
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message });
    }
};


