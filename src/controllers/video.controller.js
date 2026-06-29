import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";
import { invalidateCache } from "../middlewares/cache.middleware.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// GET /api/v1/videos
// Returns all published videos. This is a read-heavy, public endpoint —
// a good first candidate for caching.
const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const videos = await Video.find({ isPublished: true })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

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

    await Video.findByIdAndUpdate(videoId, { $inc: { views: 1 } });

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
    const { title, description, duration } = req.body;

    if (!title || !description || !duration) {
        throw new ApiError(400, "Title, description and duration are required");
    }

    const videoLocalPath = req.files?.videoFile?.[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

    if (!videoLocalPath) {
        throw new ApiError(400, "Video file is required");
    }

    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail is required");
    }

    const videoFile = await uploadOnCloudinary(videoLocalPath);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if (!videoFile) {
        throw new ApiError(500, "Failed to upload video");
    }

    if (!thumbnail) {
        throw new ApiError(500, "Failed to upload thumbnail");
    }

    const video = await Video.create({
        title,
        description,
        duration,
        videoFile: videoFile.url,
        thumbnail: thumbnail.url,
        owner: req.user?._id,
    });

    await invalidateCache("cache:/api/v1/videos*");

    return res.status(201).json(
        new ApiResponse(201, video, "Video published successfully")
    );
});

export { getAllVideos, getVideoById, createVideo };