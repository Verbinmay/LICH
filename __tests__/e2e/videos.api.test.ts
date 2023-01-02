import request from "supertest";
import { app, TypeVidios } from "../../src";

describe("/videos", () => {
  beforeAll(async () => {
    await request(app).delete("/testing/all-data");
  });

  it("Should return status 200 and empty array", async () => {
    await request(app).get("/videos").expect(200, []);
  });

  it("Should return status 201 and create new post", async () => {
    await request(app)
      .post("/videos")
      .send({
        title: "New York",
        author: "Tom Baraun",
        availableResolutions: ["P144"],
      })
      .expect(201);
  });

  it("Should return status 400 and error (no title)", async () => {
    await request(app)
      .post("/videos")
      .send({
        title: "",
        author: "Tom Braun",
        availableResolutions: ["P144"],
      })
      .expect(400);
  });

  it("Should return status 400 and error (title>40)", async () => {
    await request(app)
      .post("/videos")
      .send({
        title:
          "New YorkNew YorkNew YorkNew YorkNew YorkNew YorkNew YorkNew YorkNew YorkNew York",
        author: "Tom Braun",
        availableResolutions: ["P144"],
      })
      .expect(400);
  });

  it("Should return status 400 and error (no author)", async () => {
    await request(app)
      .post("/videos")
      .send({
        title: "New York",
        author: "",
        availableResolutions: ["P144"],
      })
      .expect(400);
  });

  it("Should return status 400 and error (author>20)", async () => {
    await request(app)
      .post("/videos")
      .send({
        title: "New York",
        author: "Tom BraunTom BraunTom BraunTom BraunTom Braun",
        availableResolutions: ["P144"],
      })
      .expect(400);
  });

  it("Should return status 400 and error (1<=minAgeRestriction<=18)", async () => {
    await request(app)
      .post("/videos")
      .send({
        title: "New York",
        author: "Tom Braun",
        minAgeRestriction: 19,
        availableResolutions: ["P144"],
      })
      .expect(400);
  });

  it("Should return status 400 and error ( availableResolutions isnt right)", async () => {
    await request(app)
      .post("/videos")
      .send({
        title: "New York",
        author: "Tom Braun",
        availableResolutions: ["P144", "366"],
      })
      .expect(400);
  });

  it("Should return status 400 and error ( availableResolutions [])", async () => {
    await request(app)
      .post("/videos")
      .send({
        title: "New York",
        author: "Tom Braun",
        availableResolutions: [],
      })
      .expect(400);
  });

  it("Should return status 400 and error (  availableResolutions didnt exist)", async () => {
    await request(app)
      .post("/videos")
      .send({
        title: "New York",
        author: "Tom Braun",
      })
      .expect(400);
  });
});

describe("/videos", () => {
  beforeAll(async () => {
    await request(app).delete("/testing/all-data");
  });

  let createdVideoId: any = null;
  it("Should create new post, do get, and find no differences", async () => {
    const createResponse = await request(app)
      .post("/videos")
      .send({
        title: "New York",
        author: "Tom Braun",
        availableResolutions: ["P144"],
      })
      .expect(201);

    type LO = {
      id: number;
      title: string;
      author: string;
      availableResolutions: Array<string>;
    };
    const getVideoViewModel = (bdVid: {
      id: number;
      title: string;
      author: string;
      canBeDownloaded: boolean;
      minAgeRestriction: number | null;
      createdAt: string;
      publicationDate: string;
      availableResolutions: Array<string>;
    }): LO => {
      return {
        id: bdVid.id,
        title: bdVid.title,
        author: bdVid.author,
        availableResolutions: bdVid.availableResolutions,
      };
    };

    createdVideoId = createResponse.body;

    const getArray = await request(app)
      .get("/videos")
      .expect(200, [createdVideoId]);

    let newViewArray = getArray.body.map(getVideoViewModel);

    expect(newViewArray).toEqual([
      {
        id: expect.any(Number),
        title: "New York",
        author: "Tom Braun",
        availableResolutions: ["P144"],
      },
    ]);
  });

  it("Should return status 200 and id 0 video", async () => {
    const createResponse = await request(app).get("/videos/0").expect(200);

    let createdVideo = createResponse.body;

    expect(createdVideo).toEqual({
      id: 0,
      title: "New York",
      author: "Tom Braun",
      canBeDownloaded: false,
      minAgeRestriction: null,
      createdAt: expect.any(String),
      publicationDate: expect.any(String),
      availableResolutions: ["P144"],
    });
  });

  ////////////////

  it("Should return status 404 and error (no id)", async () => {
    await request(app)
      .put("/videos/88")
      .send({
        title: "Murmansk",
        author: "Tom Braun",
        availableResolutions: ["P144"],
      })
      .expect(404);
  });


  it("Should return status 204 and update post", async () => {
    const createResponse = await request(app)
      .put("/videos/0")
      .send({
        title: "Murmansk",
        author: "Tom Braun",
        minAgeRestriction: 3,
        availableResolutions: ["P144"],
      })
      .expect(204);
      let createdVideo = createResponse.body;

    expect(createdVideo).toEqual({
      id: 0,
      title: "Murmansk",
      author: "Tom Braun",
      canBeDownloaded: false,
      minAgeRestriction: 3,
      createdAt: expect.any(String),
      publicationDate: expect.any(String),
      availableResolutions: ["P144"],
    });
  });

  it("Should return status 400 and error (title>40)", async () => {
    await request(app)
      .put("/videos/0")
      .send({
        title:
          "New YorkNew YorkNew YorkNew YorkNew YorkNew YorkNew YorkNew YorkNew YorkNew York",
        author: "Tom Braun",
        availableResolutions: ["P144"],
      })
      .expect(400);
  });


  it("Should return status 400 and error (author>20)", async () => {
    await request(app)
      .put("/videos/0")
      .send({
        title: "New York",
        author: "Tom BraunTom BraunTom BraunTom BraunTom Braun",
        availableResolutions: ["P144"],
      })
      .expect(400);
  });

  it("Should return status 400 and error (1<=minAgeRestriction<=18)", async () => {
    await request(app)
      .put("/videos/0")
      .send({
        title: "New York",
        author: "Tom Braun",
        minAgeRestriction: 19,
        availableResolutions: ["P144"],
      })
      .expect(400);
  });

  it("Should return status 400 and error ( availableResolutions isnt right)", async () => {
    await request(app)
      .put("/videos/0")
      .send({
        title: "New York",
        author: "Tom Braun",
        availableResolutions: ["P144", "366"],
      })
      .expect(400);
  });

  it("Should return status 400 and error ( availableResolutions [])", async () => {
    await request(app)
      .put("/videos/0")
      .send({
        title: "New York",
        author: "Tom Braun",
        availableResolutions: [],
      })
      .expect(400);
  });

  it("Should return status 404 and error (no id)", async () => {
    await request(app)
      .delete("/videos/88")
      .expect(404);
  });
  
  it("Should return status 204", async () => {
    await request(app)
      .delete("/videos/0")
      .expect(204);
  });


});
