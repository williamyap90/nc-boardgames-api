const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const app = require("../app.js");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("/api", () => {
  describe("GET", () => {
    test("200: response from the api endpoint", async () => {
      const res = await request(app).get("/api").expect(200);
      expect(res.body.message).toBe("All ok from /api");
    });
    test("404: responds with custom error message when provided an invalid path", async () => {
      const res = await request(app).get("/api/notAPath").expect(404);
      expect(res.body.message).toBe("Invalid path");
    });
  });
});

describe("/api/categories", () => {
  describe("GET", () => {
    test("200: responds with an array of categories", async () => {
      const res = await request(app).get("/api/categories").expect(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(4);
    });
  });
});

describe("/api/reviews", () => {
  describe("GET /:review_id", () => {
    test("200: responds with an array of the specified review_id", async () => {
      const res = await request(app).get("/api/reviews/2").expect(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(1);
    });
    test("200: responds with an array of the specified review_id in the correct format", async () => {
      const res = await request(app).get("/api/reviews/2").expect(200);
      res.body.forEach((review) => {
        expect(review).toHaveProperty("owner");
        expect(review).toHaveProperty("title");
        expect(review).toHaveProperty("review_id");
        expect(review).toHaveProperty("review_body");
        expect(review).toHaveProperty("designer");
        expect(review).toHaveProperty("review_img_url");
        expect(review).toHaveProperty("category");
        expect(review).toHaveProperty("created_at");
        expect(review).toHaveProperty("votes");
        expect(review).toHaveProperty("comment_count");
      });
    });
    test("400: responds with a message for invalid review_id ", async () => {
      const res = await request(app).get("/api/reviews/notAnId").expect(400);
      expect(res.body.message).toBe(
        'invalid input syntax for type integer: "notAnId"'
      );
    });
    test("404: responds with not found for valid but non-existent review_id ", async () => {
      const res = await request(app).get("/api/reviews/99999").expect(404);
      expect(res.text).toBe("Review id 99999 not found");
    });
  });

  describe("PATCH /:review_id", () => {
    test("201: responds with the updated object for specified review_id ", async () => {
      const updateVotes = { inc_votes: 3 };
      const res = await request(app)
        .patch("/api/reviews/2")
        .send(updateVotes)
        .expect(201);
      expect(res.body[0].votes).toEqual(8);
      res.body.forEach((review) => {
        expect(review).toHaveProperty("owner");
        expect(review).toHaveProperty("title");
        expect(review).toHaveProperty("review_id");
        expect(review).toHaveProperty("review_body");
        expect(review).toHaveProperty("designer");
        expect(review).toHaveProperty("review_img_url");
        expect(review).toHaveProperty("category");
        expect(review).toHaveProperty("created_at");
        expect(review).toHaveProperty("votes");
      });
    });
    test("400: responds with a message for invalid review_id ", async () => {
      const updateVotes = { inc_votes: 3 };
      const res = await request(app)
        .patch("/api/reviews/notAnId")
        .send(updateVotes)
        .expect(400);
      expect(res.body.message).toBe(
        'invalid input syntax for type integer: "notAnId"'
      );
    });
    test("404: responds with not found for valid but non-existent review_id ", async () => {
      const updateVotes = { inc_votes: 3 };
      const res = await request(app)
        .patch("/api/reviews/99999")
        .send(updateVotes)
        .expect(404);
      expect(res.text).toBe("Review id 99999 not found");
    });
    test("400: responds with a message for no inc_votes on request body", async () => {
      const updateBody = {};
      const res = await request(app)
        .patch("/api/reviews/2")
        .send(updateBody)
        .expect(400);
      expect(res.text).toBe("No inc_votes on request body");
    });
    test("400: responds with a message when invalid value provided for inc_votes on request body", async () => {
      const updateBody = { inc_votes: "cat" };
      const res = await request(app)
        .patch("/api/reviews/2")
        .send(updateBody)
        .expect(400);
      expect(res.body.message).toBe(
        'invalid input syntax for type integer: "cat"'
      );
    });
    test.only("400: responds with a message when invalid properties present in request body", async () => {
      const updateBody = { inc_votes: "cat", name: "mitch" };
      const res = await request(app)
        .patch("/api/reviews/2")
        .send(updateBody)
        .expect(400);
      expect(res.body.message).toBe(
        'invalid input syntax for type integer: "cat"'
      );
    });
  });
});
