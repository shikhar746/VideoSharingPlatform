//lets continue connecting express here instead of index.js

import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use( cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}))

//setup how to recieve data p3opl3 2ill give in
//json format or in forms directly
app.use(express.json({limit :"16kb"}))
app.use(express.urlencoded({extended: true, limit:
    "16kb"
}))
app.use(express.static("public"))
app.use(cookieParser())//to take data from cookies

export {app}