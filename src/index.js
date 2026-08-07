import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { connectRedis } from "./db/redis.js";
import {app} from "./app.js";

// this actually silently fails when deployed coz .env does not exist in production, but we don't want to crash the app for that reason, so we just log it and move on
dotenv.config({
    path: './.env'
})

connectRedis(); // fire-and-forget; cacheMiddleware checks redis.status before using it

connectDB()
.then(()=>{
    const PORT = process.env.PORT || 8000
    app.listen(PORT, ()=> {
        console.log(`server is running at port :
            ${PORT}`)
    })
})
.catch((err)=>{
    console.log("MONGO db connection failed !!!", err);
})