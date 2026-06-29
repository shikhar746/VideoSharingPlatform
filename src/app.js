import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
//routes import
import userRouter from "./routes/user.routes.js"
import videoRouter from "./routes/video.routes.js"
import likeRouter from "./routes/like.routes.js"

const app = express()

app.use( cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit :"16kb"}))
app.use(express.urlencoded({extended: true, limit:
    "16kb"
}))
app.use(express.static("public"))
app.use(cookieParser())

//routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/likes", likeRouter) 

//http://localhost:8000/api/v1/users/register
//http://localhost:8000/api/v1/videos
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    return res.status(statusCode).json({
        success: false,
        message: err.message,
        errors: err.errors || []
    })
})

export {app}