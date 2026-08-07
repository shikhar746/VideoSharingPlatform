# VideoTube Backend API

A production-ready RESTful API for a modern video-sharing platform built with Node.js, Express 5, MongoDB, and Redis. Features JWT authentication (access & refresh tokens), media management via Cloudinary, automated cache invalidation, relational aggregation pipelines, and an automated Jest test suite.

---

## 🛠️ Tech Stack & Key Libraries

- **Runtime / Framework:** Node.js, Express 5
- **Database:** MongoDB with Mongoose (using aggregation pipelines for relational queries like channel metrics and sub-documents)
- **Caching Layer:** Redis via Upstash REST client (`@upstash/redis`) — stateless HTTPS requests with fail-open safety
- **Media Management:** Cloudinary (video and thumbnail uploads with automated asset removal on update/delete)
- **Auth & Security:** JWT (short-lived access tokens, server-validated refresh tokens), `bcryptjs` password hashing, HTTP-only cookies
- **File Handling:** Multer (local disk staging prior to Cloudinary upload)
- **Test Runner:** Jest, Supertest, Babel

---

## 🏗️ Architecture & Core Mechanics

- **Fail-Open Caching:** Caching operations check Redis connectivity dynamically. If Redis credentials are omitted or network calls fail, the middleware gracefully falls through to MongoDB.
- **Cache Eviction on Writes:** Read endpoints (`GET /api/v1/videos`) are cached for 60 seconds using key pattern `cache:{originalUrl}`. Mutation endpoints (`POST`, `PATCH`, `DELETE`) call `invalidateCache(pattern)` to purge stale cache entries.
- **Server-Side Refresh Tokens:** Refresh tokens are stored directly on the user schema. On logout or token rotation, tokens are invalidated server-side, preventing reuse without needing an external revocation list.
- **Automatic Cloudinary Cleanup:** Updating avatars, cover images, or thumbnails automatically removes old assets from Cloudinary before uploading new ones. Deleting a video purges both the video stream file and thumbnail image from Cloudinary.

---

## 🚀 API Endpoint Reference

### 👤 Users (`/api/v1/users`)
- `POST /register` — Register user with avatar (required) and cover image (optional).
- `POST /login` — Authenticate user and issue `accessToken` & `refreshToken` cookies.
- `POST /logout` (Protected) — Clear cookies and invalidate refresh token server-side.
- `POST /refresh-token` — Issue a new token pair using a valid refresh token.
- `PATCH /update-account` (Protected) — Update full name and email address.
- `POST /change-password` (Protected) — Change current account password.
- `PATCH /avatar` (Protected) — Upload new avatar (deletes old avatar from Cloudinary).
- `PATCH /cover-image` (Protected) — Upload new cover image (deletes old cover image from Cloudinary).
- `GET /c/:username` (Protected) — Fetch user channel profile with subscriber count, subscription status, and details.
- `POST /watch/:videoId` (Protected) — Add video to user watch history.
- `GET /history` (Protected) — Get user watch history with populated owner information.

### 📹 Videos (`/api/v1/videos`)
- `GET /` — List published videos with pagination (cached 60s).
- `GET /:videoId` — Get single video details and increment view count (cached 60s).
- `POST /` (Protected) — Create and upload new video file + thumbnail.
- `PATCH /:videoId` (Protected) — Update title, description, or thumbnail image.
- `DELETE /:videoId` (Protected) — Delete video document and associated Cloudinary assets.
- `PATCH /toggle/v/:videoId` (Protected) — Toggle video `isPublished` visibility state.

### 🔔 Subscriptions (`/api/v1/subscriptions`)
- `POST /c/:channelId` (Protected) — Toggle subscribe / unsubscribe to a channel.
- `GET /c/:channelId` (Protected) — Get list of subscribers for a given channel.
- `GET /u/:subscriberId` (Protected) — Get list of channels a user has subscribed to.

### 👍 Likes (`/api/v1/likes`)
- `POST /video/:videoId` (Protected) — Toggle like/unlike on a video.
- `GET /video/:videoId` (Protected) — Get total like count and whether requesting user has liked the video.

### 💬 Comments (`/api/v1/comments`)
- `GET /:videoId` (Protected) — Fetch paginated comments for a video with owner details.
- `POST /:videoId` (Protected) — Add a comment to a video.
- `PATCH /c/:commentId` (Protected) — Update a comment.
- `DELETE /c/:commentId` (Protected) — Delete a comment.

### 🐦 Tweets / Community Posts (`/api/v1/tweets`)
- `POST /` (Protected) — Create a community post/tweet.
- `GET /user/:userId` (Protected) — Fetch tweets published by a specific user.
- `PATCH /:tweetId` (Protected) — Update tweet content.
- `DELETE /:tweetId` (Protected) — Delete a tweet.

### 📜 Playlists (`/api/v1/playlists`)
- `POST /` (Protected) — Create a new playlist.
- `GET /:playlistId` (Protected) — Get playlist by ID with populated video details.
- `PATCH /:playlistId` (Protected) — Update playlist title and description.
- `DELETE /:playlistId` (Protected) — Delete playlist.
- `PATCH /add/:videoId/:playlistId` (Protected) — Add video to playlist.
- `PATCH /remove/:videoId/:playlistId` (Protected) — Remove video from playlist.
- `GET /user/:userId` (Protected) — Get all playlists created by a user.

---

## 💻 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB instance (Local or MongoDB Atlas)
- Cloudinary Account (for media uploads)
- Upstash Redis instance (Optional, for API caching)

### Installation & Environment Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd VideoSharingPlatform
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy `.env.example` to `.env` and populate the required values:
   ```bash
   cp .env.example .env
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```

5. **Run in Production Mode:**
   ```bash
   npm start
   ```

---

## 🧪 Testing

The project includes an automated Jest test suite covering routes, controllers, and error handling across all modules:

```bash
npm test
```