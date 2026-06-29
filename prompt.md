I'm continuing work on an existing Express + MongoDB "videotube" backend project (chai-aur-code style). This is going on my CV/resume for internship applications, and I will need to give a live demo of it in about a month. Treat this as a real deliverable, not a learning toy — code needs to actually run, not just look plausible on a skim.

CURRENT VERIFIED STATE (don't assume more than this exists):
- POST /api/v1/users/register works: multipart form (fullName, email, username, password, avatar file required, coverImage file optional), creates a User in MongoDB, uploads images to Cloudinary.
- GET /api/v1/videos and GET /api/v1/videos/:videoId exist and return data from MongoDB, with a Redis caching middleware (using @upstash/redis REST client, not ioredis/TCP) wrapping both routes at a 60s TTL. The caching logic has been tested against a mock Redis, but NOT yet confirmed against the real Upstash account — this still needs to be verified by actually running the server and checking response headers for X-Cache: HIT vs MISS.
- POST /api/v1/videos exists in code but is broken: it references req.user?._id to set video ownership, but there is no auth middleware anywhere in the project, so req.user is always undefined. This endpoint currently creates ownerless videos.
- There is NO login endpoint, NO logout endpoint, NO refresh-token endpoint, and NO auth middleware at all. The User model already has generateAccessToken(), generateRefreshToken(), and isPasswordCorrect() methods defined and working, but nothing in the routes/controllers calls them.
- There is no frontend yet.

WHAT I NEED, IN ORDER:

PART A — Verify what already exists actually runs:
1. Start the backend with my real .env values (MongoDB URI, Upstash REST URL + token, JWT secrets) and confirm:
   - Server boots without errors
   - MongoDB connects
   - Redis client logs "ready" (or equivalent) on startup
   - GET /api/v1/videos returns X-Cache: MISS on first call, X-Cache: HIT on second call within 60s
   If any of these fail, fix the root cause and tell me what was wrong — don't just suppress the error.

PART B — Build real authentication:
1. Add a login controller (POST /api/v1/users/login): accept username or email + password, verify with isPasswordCorrect(), and on success generate access + refresh tokens via the existing model methods, set the refresh token as an httpOnly cookie, and return the access token + user object (excluding password and refreshToken fields) in the response body.
2. Add a logout controller (POST /api/v1/users/logout): clear the refresh token cookie and unset refreshToken on the user document. This needs auth middleware to know which user is logging out.
3. Add auth middleware (src/middlewares/auth.middleware.js): verify the access token from the Authorization header or cookie, attach the decoded user to req.user, reject with 401 if missing/invalid. Use this to actually fix the broken req.user?._id reference in createVideo.
4. Add a refresh-token endpoint (POST /api/v1/users/refresh-token): verify the refresh token, issue a new access token, so users don't get logged out every 15 minutes.
5. Wire all of this into src/routes/user.routes.js.

PART C — Frontend (React + Vite), built against what ACTUALLY exists after Part B, not before:
1. Scaffold frontend/ as a sibling to src/, plain JS, axios with withCredentials: true, react-router-dom.
2. Pages: Register, Login (calling the real endpoint from Part B), a protected video list page (GET /api/v1/videos) that requires a valid session, and basic logout.
3. Handle the access-token refresh flow on the frontend: if a request gets 401, try the refresh endpoint once, then retry, then redirect to login if that also fails.
4. Don't build pages for features that don't exist on the backend (no upload-video page unless Part B's createVideo is also properly fixed with auth, no comments/likes/subscriptions pages).

GENERAL RULES:
- After each part, tell me explicitly what you tested and how (not just "this should work") — if something can't be verified in this environment (e.g., no access to my real database/Redis), say so directly instead of implying it's been confirmed.
- Don't add files, routes, or features beyond what's listed here "for completeness" — a half-built feature on a CV repo is worse than an honestly smaller scope that fully works.
- Flag anywhere the existing code (registerUser, video model, etc.) doesn't match what new auth code needs, instead of silently patching around mismatches.