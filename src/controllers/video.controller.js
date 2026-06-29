import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";
import { invalidateCache } from "../middlewares/cache.middleware.js";

// GET /api/v1/videos
// Returns all published videos. This is a read-heavy, public endpoint —
// a good first candidate for caching.
const getAllVideos = asyncHandler(async (req, res) => {
    const videos = await Video.find({ isPublished: true }).sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, videos, "Videos fetched successfully")
    );
});

// GET /api/v1/videos/:videoId
const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    return res.status(200).json(
        new ApiResponse(200, video, "Video fetched successfully")
    );
});

// POST /api/v1/videos
// Not part of the original ask, but included as a minimal example of how
// to invalidate the cache after a write — wire this up once you actually
// build out video upload (this assumes req.body has title/description/etc.
// and that videoFile/thumbnail URLs are already resolved, e.g. via Cloudinary).
const createVideo = asyncHandler(async (req, res) => {
    const { title, description, duration, videoFile, thumbnail } = req.body;

    if ([title, description, videoFile, thumbnail].some((f) => !f)) {
        throw new ApiError(400, "All fields are required");
    }

    const video = await Video.create({
        title,
        description,
        duration,
        videoFile,
        thumbnail,
        owner: req.user?._id, // assumes auth middleware sets req.user
    });

    // Invalidate the cached video list so the new video shows up immediately
    // instead of waiting out the TTL.
    await invalidateCache("cache:/api/v1/videos*");

    return res.status(201).json(
        new ApiResponse(201, video, "Video published successfully")
    );
});

export { getAllVideos, getVideoById, createVideo };