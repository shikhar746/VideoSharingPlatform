import request from "supertest";
import { app } from "../src/app.js";

describe("Subscription Routes", () => {
    it("should return 401 when toggling subscription without auth token", async () => {
        const response = await request(app)
            .post("/api/v1/subscriptions/c/64f1a2b3c4d5e6f7a8b9c0d1");
        expect(response.status).toBe(401);
    });
});
