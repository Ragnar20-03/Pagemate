import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken";
import { User } from "../db/schema";
import { JWT_SECRETE } from "../config/dotenv";
JWT_SECRETE
User

const JWT_SECRET = process.env.JWT_SECRET as string; // Ensure this is defined in .env

export const userMiddleware: RequestHandler | any = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("Request URL:", req.originalUrl);

        // **Check for token in both cookies & Authorization header**
        let token = req.cookies?.token || req.header("Authorization")?.split(" ")[1];

        console.log("Token received:", token);

        if (!token) {
            return res.status(401).json({ msg: "Unauthorized Request!" });
        }

        // **Verify the token**
        let verifiedToken = jwt.verify(token, JWT_SECRETE) as JwtPayload;

        if (!verifiedToken || !verifiedToken.uid) {
            return res.status(401).json({ msg: "Unauthorized Request!" });
        }

        // **Find user in DB to confirm existence**
        let userExists = await User.findById(verifiedToken.uid);
        if (!userExists) {
            return res.status(401).json({ msg: "User not found, Unauthorized Request!" });
        }

        // **Attach `uid` to the request for further use**
        req.uid = verifiedToken.uid;

        next();
    } catch (error) {
        console.log("Error in userMiddleware:", error);

        if (error instanceof TokenExpiredError) {
            return res.status(401).json({ msg: "Token expired. Please log in again." });
        }

        return res.status(500).json({ msg: "Unauthorized Request!" });
    }
};
