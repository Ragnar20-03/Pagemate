import express from "express";
import { getAllUsers, loginController, registerController } from "../controller/user";
import { userMiddleware, } from "../middleware/userMiddleware";
import { createClubController, joinClubController } from "../controller/club";
export const router = express.Router()

router.post('/register', registerController)
router.post('/login', loginController)
// router.post('/forgotPassword') // will be last

router.post('/createClub', userMiddleware, createClubController)
router.post('/joinClub', userMiddleware, joinClubController)

// router.post('/addBook',userMiddleware,)

router.get('/getAllUsers', userMiddleware, getAllUsers)
// router.post('/addFreind',userMiddleware,)

// router.post('/message',userMiddleware,) // will be also last
