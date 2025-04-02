import { Request, RequestHandler, Response } from "express";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { User } from "../db/schema";
import { JWT_SECRETE } from "../config/dotenv";
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

}


