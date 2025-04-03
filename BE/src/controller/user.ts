import { Request, RequestHandler, Response } from "express";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { AddFreind, User } from "../db/schema";
import { JWT_SECRETE } from "../config/dotenv";
import mongoose, { mongo } from "mongoose";
export const registerController: RequestHandler | any = async (req: Request, res: Response) => {
    try {
        const { fname, lname, email, password } = req.body
        if (!fname || !lname || !email || !password) {
            return res.status(501).json({
                status: "failed",
                msg: "AllFeilds are necessary !",
            })
        }

        let newUser = new User({ fname, lname, email, password });
        if (newUser) {
            await newUser.save()
            return res.status(200).json({
                status: "success",
                msg: "Account Created Succesfully !"
            })
        }
        else {
            return res.status(200).json({
                status: "failed",
                msg: "Account Created Failed !"
            })
        }
    } catch (err) {
        // console.log("error is : ", err);

        return res.status(501).json({
            status: "failed",
            msg: "Something went wrong"
        })
    }
}

export const loginController: RequestHandler | any = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(501).json({
                status: "failed",
                msg: "AllFeilds are necessary !",
            })
        }
        let user = await User.findOne({ email })
        if (user) {
            //@ts-ignore
            if (await bcrypt.compare(password, user.password)) {
                // JSOn Web Token Generation
                let token = jwt.sign({ uid: user._id }, JWT_SECRETE)
                // res.cookie('token', token)
                return res.status(200).json({
                    status: "success",
                    msg: "Login Succesfull !",
                    token
                })
            }
            else {
                return res.status(501).json({
                    status: "failed",
                    msg: "Password Mismatch !"
                })
            }
        }
        else {
            return res.status(404).json({
                status: "failed",
                msg: "Account Not Found !"
            })
        }
    } catch (err) {
        // console.log("error is : ", err);

        return res.status(501).json({
            status: "failed",
            msg: "Something went wrong"
        })
    }
}

export const getAllUsers: RequestHandler | any = async (req: Request, res: Response) => {
    let users = await User.find();
    return res.status(200).json({
        status: "success",
        users
    })
}
export const AddFreindController: RequestHandler | any = async (req: Request, res: Response) => {
    try {
        let uid = req.uid
        let { receiver } = req.body;

        if (!receiver) {
            return res.status(501).json({
                status: "failed", msg: "All Feilds are necessary"
            })
        }

        let request = await AddFreind.create({ date: Date.now(), sender: uid, receiver, isAccepted: "pending" })
        if (request) {
            let user = await User.findByIdAndUpdate(receiver, { $addToSet: { requests: request } })
            if (user) {
                return res.status(200).json({
                    status: "success",
                    msg: "Freind Request sent succesfully !"
                })
            }
            else {
                return res.status(501).json({
                    status: "failed",
                    msg: "unable to send freind request"
                })
            }
        }
        else {
            return res.status(501).json({
                status: "failed",
                msg: "unable to craete Request "
            })
        }

    } catch (err) {
        console.log("error is : ", err);

        return res.status(501).json({
            status: "failed",
            msg: "Something went wrong ",
        })
    }
}



export const acceptFreindRequestController: RequestHandler | any = async (req: Request, res: Response) => {
    try {
        let uid = req.uid;  // Current user accepting the request
        let reqId = req.params.reqId; // Friend request ID

        if (!mongoose.Types.ObjectId.isValid(reqId)) {
            return res.status(400).json({ status: "failed", msg: "Invalid request ID" });
        }

        // Find the friend request
        let request = await AddFreind.findById(reqId);
        if (!request) {
            return res.status(404).json({ status: "failed", msg: "Friend request not found" });
        }

        if (request.isAccepted !== "pending") {
            return res.status(400).json({ status: "failed", msg: "Request already processed" });
        }

        console.log("req.receiver : " + request.receiver + " uid : " + uid);
        // Ensure the receiver is the one accepting the request
        // @ts-ignore
        if (request.receiver.toString() !== uid) {
            return res.status(403).json({ status: "failed", msg: "Unauthorized action" });
        }

        let senderId = request.sender;
        let receiverId = request.receiver;

        // Update the request status to "accepted"
        request.isAccepted = "accepted";
        await request.save();

        // Add each other as friends
        await User.findByIdAndUpdate(senderId, { $addToSet: { freinds: receiverId } });
        await User.findByIdAndUpdate(receiverId, { $addToSet: { freinds: senderId } });

        // Remove the request from both users' requests array
        await User.findByIdAndUpdate(senderId, { $pull: { requests: reqId } });
        await User.findByIdAndUpdate(receiverId, { $pull: { requests: reqId } });

        // Optionally, delete the request from the database
        await AddFreind.findByIdAndDelete(reqId);

        return res.status(200).json({
            status: "success",
            msg: "Friend request accepted",
        });

    } catch (error) {
        console.error("Error accepting friend request:", error);
        return res.status(500).json({ status: "failed", msg: "Something went wrong" });
    }
};


export const removeFreindController: RequestHandler | any = async (req: Request, res: Response) => {
    try {
        let uid = req.uid;  // Current user removing the friend
        let friendId = req.params.friendId; // Friend's user ID
        console.log("freind Id is ; ", friendId);

        if (!mongoose.Types.ObjectId.isValid(friendId)) {
            return res.status(400).json({ status: "failed", msg: "Invalid friend ID" });
        }

        let user = await User.findById(uid);
        let friend = await User.findById(friendId);

        if (!user || !friend) {
            return res.status(404).json({ status: "failed", msg: "User or friend not found" });
        }

        // Ensure they are actually friends before removing
        if (
            !user.freinds.map(f => f.toString()).includes(friendId) ||
            //@ts-ignore
            !friend.freinds.map(f => f.toString()).includes(uid.toString())
        ) {
            return res.status(400).json({ status: "failed", msg: "Not friends" });
        }

        // Remove each other from their friends list
        await User.findByIdAndUpdate(uid, { $pull: { freinds: friendId } });
        await User.findByIdAndUpdate(friendId, { $pull: { freinds: uid } });

        return res.status(200).json({
            status: "success",
            msg: "Friend removed successfully",
        });

    } catch (error) {
        console.error("Error removing friend:", error);
        return res.status(500).json({ status: "failed", msg: "Something went wrong" });
    }
};
