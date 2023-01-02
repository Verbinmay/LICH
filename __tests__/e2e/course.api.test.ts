import request from "supertest";
import { app } from "../../src";

describe("/videos", () => {
  beforeAll(async () => {
    await request(app).delete("/testing/all-data");
  });

  it("should return status 200 and empty array", async () => {
    await request(app).get("/videos").expect(200, []);
  });
});
