import request from "supertest";
import { app } from "../src/app.js";

describe("Playlist Routes", () => {
    it("should return 401 when fetching playlist without auth token", async () => {
        const response = await request(app)
            .get("/api/v1/playlists/64f1a2b3c4d5e6f7a8b9c0d1");
        expect(response.status).toBe(401);
    });
});
