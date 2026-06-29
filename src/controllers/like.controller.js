import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    const video = await Video.findById(videoId);
    if (!video) throw new ApiError(404, "Video not found");

    const existingLike = await Like.findOne({
        video: videoId,
        likedBy: req.user._id
    });

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id);
        return res.status(200).json(
            new ApiResponse(200, { liked: false }, "Video unliked")
        );
    }

    await Like.create({
        video: videoId,
        likedBy: req.user._id
    });

    return res.status(200).json(
        new ApiResponse(200, { liked: true }, "Video liked")
    );
});

const getVideoLikes = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    const video = await Video.findById(videoId);
    if (!video) throw new ApiError(404, "Video not found");

    const likesCount = await Like.countDocuments({ video: videoId });
    const isLiked = await Like.findOne({
        video: videoId,
        likedBy: req.user._id
    });

    return res.status(200).json(
        new ApiResponse(200, {
            likesCount,
            isLiked: !!isLiked
        }, "Likes fetched")
    );
});

export { toggleVideoLike, getVideoLikes };