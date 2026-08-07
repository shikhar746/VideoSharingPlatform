import request from "supertest";
import { app } from "../src/app.js";

describe("Tweet Routes", () => {
    it("should return 401 when creating tweet without auth token", async () => {
        const response = await request(app)
            .post("/api/v1/tweets")
            .send({ content: "Hello world" });
        expect(response.status).toBe(401);
    });
});
