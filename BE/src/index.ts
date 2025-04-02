import express, { Request, Response } from "express"
import { PORT } from "./config/dotenv"
import { router as userRouter } from "./routes/user"

const app = express()
app.use(express.json())
app.use("/api/v1/user", userRouter)


//@ts-ignore
app.get('/', async (req: Request, res: Response) => {
    return res.status(200).json({
        msg: "Jay Ganesh ! from PageMate"
    })
})
app.listen(PORT, () => (
    console.log("Server started on port number : ", PORT)
))