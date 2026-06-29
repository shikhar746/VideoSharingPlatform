import { Router } from "express";
import { getAllVideos, getVideoById, createVideo } from "../controllers/video.controller.js";
import { cacheMiddleware } from "../middlewares/cache.middleware.js";

const router = Router();

// Cached for 60s — read-heavy, public, not user-specific
router.route("/").get(cacheMiddleware(60), getAllVideos);
router.route("/:videoId").get(cacheMiddleware(60), getVideoById);

// Mutating route — never cached. Add auth middleware here once it exists.
router.route("/").post(createVideo);

export default router;