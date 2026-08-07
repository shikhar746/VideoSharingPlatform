import request from "supertest";
import { app } from "../src/app.js";

describe("Video Routes", () => {
    it("should return 400 for invalid video ID", async () => {
        const response = await request(app)
            .get("/api/v1/videos/invalid-id");
        expect(response.status).toBe(400);
    });
});
