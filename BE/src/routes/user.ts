import express from "express";
import { acceptFreindRequestController, AddFreindController, getAllUsers, loginController, registerController, removeFreindController } from "../controller/user";
import { userMiddleware, } from "../middleware/userMiddleware";
import { createClubController, getAllClubsController, joinClubController } from "../controller/club";

import { addBookController } from "../controller/book";
import { upload } from "../config/multer";
export const router = express.Router()

router.post('/register', registerController)
router.post('/login', loginController)
// router.post('/forgotPassword') // will be last

router.post('/createClub', userMiddleware, createClubController)
router.post('/joinClub', userMiddleware, joinClubController)
router.post('/getAllClubs', userMiddleware, getAllClubsController)

router.post("/addBook/:clubId", userMiddleware, upload.single("book"), addBookController);

router.get('/getAllUsers', userMiddleware, getAllUsers)
router.post('/addFreind', userMiddleware, AddFreindController)
router.post('/acceptRequest/:reqId', userMiddleware, acceptFreindRequestController)
router.post('/removeFreind/:friendId', userMiddleware, removeFreindController)

// router.post('/message',userMiddleware,) // will be also last
