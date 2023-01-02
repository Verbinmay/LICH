
import request from "supertest";
import { app } from "../../src";



describe("/videos", () => {
    beforeAll(async () => {
      await request(app).delete("/testing/all-data");
    });

    

});