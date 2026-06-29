import { Router } from "express";
import {
    getAllVideos,
    getVideoById,
    createVideo,
} from "../controllers/video.controller.js";
import { cacheMiddleware } from "../middlewares/cache.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(cacheMiddleware(60), getAllVideos);
router.route("/:videoId").get(cacheMiddleware(60), getVideoById);

// Now properly protected — req.user._id will exist
router.route("/").post(verifyJWT, createVideo);

export default router;