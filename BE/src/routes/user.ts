import express from "express";
export const router = express.Router()
router.post('/register')
router.post('/login')
router.post('/forgotPassword') // will be last

router.post('/createClub')
router.post('/joinClub')

router.post('/addBook')

router.get('/getAllUsers')
router.post('/addFreind')

router.post('/message') // will be also last
