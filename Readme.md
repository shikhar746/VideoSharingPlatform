# VideoTube Backend

A production-ready REST API for a video sharing platform built with Node.js, Express, MongoDB, and Redis.

## Tech Stack
- Node.js + Express 5
- MongoDB + Mongoose
- Redis (Upstash) for caching
- Cloudinary for media storage
- JWT authentication (access + refresh tokens)

## Features
- User registration with avatar/cover image upload
- JWT auth with access tokens (15m) and refresh tokens (7d)
- Redis caching on video endpoints with cache invalidation
- Protected routes via auth middleware

## API Endpoints

### Users
- POST /api/v1/users/register
- POST /api/v1/users/login
- POST /api/v1/users/logout (protected)
- POST /api/v1/users/refresh-token

### Videos
- GET /api/v1/videos
- GET /api/v1/videos/:videoId
- POST /api/v1/videos (protected)

## Setup
1. Clone the repo
2. Run `npm install`
3. Create `.env` from `.env.example`
4. Run `npm run dev`