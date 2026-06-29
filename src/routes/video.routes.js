import { Router } from "express";
import {
    getAllVideos,
    getVideoById,
    createVideo,
} from "../controllers/video.controller.js";
import { cacheMiddleware } from "../middlewares/cache.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/").get(cacheMiddleware(60), getAllVideos);
router.route("/:videoId").get(cacheMiddleware(60), getVideoById);

router.route("/").post(
    verifyJWT,
    upload.fields([
        { name: "videoFile", maxCount: 1 },
        { name: "thumbnail", maxCount: 1 },
    ]),
    createVideo
);

export default router;