import request from "supertest";
import { app } from "../src/app.js";

describe("User Routes & Controller", () => {
    it("should return 400 when registering without required fields", async () => {
        const response = await request(app)
            .post("/api/v1/users/register")
            .send({});
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
    });

    it("should return 401 for unauthorized access to protected route", async () => {
        const response = await request(app)
            .post("/api/v1/users/logout");
        expect(response.status).toBe(401);
    });
});
