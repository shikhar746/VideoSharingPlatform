import { Redis } from "@upstash/redis";

let redisClient = null;

const connectRedis = () => {
    if (redisClient) return redisClient;

    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
        console.log("UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN not set — caching is disabled.");
        return null;
    }

    redisClient = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });

    console.log("\n Redis (Upstash REST) client ready !!");

    return redisClient;
};

const getRedisClient = () => redisClient;

export { connectRedis, getRedisClient };