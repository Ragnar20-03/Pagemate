import { RequestHandler, Request, Response } from "express"
import { Club, User } from "../db/schema";

const generateUniqueRoomCode = async (): Promise<string> => {
    const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    while (true) {
        let code = "";
        for (let i = 0; i < 6; i++) {
            code += characters[Math.floor(Math.random() * characters.length)];
        }

        // Check if the code already exists in the database
        return code
    }
};

export const createClubController: RequestHandler | any = async (req: Request, res: Response) => {
    try {
        let uid = req.uid
        const { clubName, validTill } = req.body;
        if (!clubName || !validTill) {
            return res.status(401).json({
                status: "failed",
                msg: "all feilds are necessary!"
            })
        }
        let roomCode = await generateUniqueRoomCode()
        let newClub = await Club.create({ members: [], clubName, clubCode: roomCode, roomCode, validTill, isOpen: true, admin: uid, book: null })
        if (newClub) {
            return res.status(200).json({
                status: "success",
                msg: "Club Created Succesfully ",
                newClub
            })
        }
        else {
            return res.status(501).json({
                status: "failed",
                msg: "Club Created Failed ",
            })
        }
    } catch (err) {
        console.log("error is ....: ", err);

        return res.status(501).json({
            status: "failed",
            msg: "Something went wrong"
        })
    }
}

export const joinClubController: RequestHandler | any = async (req: Request, res: Response) => {
    let uid = req.uid
    const { clubName, clubCode } = req.body;
    let club = await Club.findOneAndUpdate({ clubCode, clubName },
        { $addToSet: { members: uid } }, // Add user to members array (prevents duplicates)
        { new: true })
    if (club) {
        await User.findOneAndUpdate({ _id: uid }, { $addToSet: { joinedClubs: club._id } })
        return res.status(200).json({
            status: "success",
            msg: "club Joined Succesfully!",
            club
        })
    }
    else {
        return res.status(200).json({
            status: "failed",
            msg: "No Such Club",

        })
    }
}


export const getAllClubsController: RequestHandler | any = async (req: Request, res: Response) => {
    let uid = req.uid
    let clubs = await User.find({ _id: uid }).populate('joinedClubs')
    return res.status(200).json({
        status: "success",
        clubs
    })
}


