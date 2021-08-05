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
      // expect(res.body.message).toBe("All ok from /api");
    });
    test("404: responds with custom error message when provided an invalid path", async () => {
      const res = await request(app).get("/api/notAPath").expect(404);
      expect(res.body.message).toBe("Invalid path");
    });
    test("200: responds with a JSON object of all the available endpoints on the server", async () => {
      const res = await request(app).get("/api").expect(200);
      expect(typeof res.body).toBe("object");
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
    test("404: responds with a not found for valid value type but non-existent review_id ", async () => {
      const res = await request(app).get("/api/reviews/99999").expect(404);
      expect(res.text).toBe("Review id 99999 not found");
    });
  });

  describe("PATCH /:review_id", () => {
    test("201: responds with the updated object for specified review_id when increasing votes", async () => {
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
    test("201: responds with the updated object for specified review_id when decreasing votes", async () => {
      const updateVotes = { inc_votes: -100 };
      const res = await request(app)
        .patch("/api/reviews/8")
        .send(updateVotes)
        .expect(201);
      expect(res.body[0].votes).toEqual(0);
    });
    test("201: responds with the updated object for specified review_id, with a vote of zero to avoid negative values", async () => {
      const updateVotes = { inc_votes: -100 };
      const res = await request(app)
        .patch("/api/reviews/2")
        .send(updateVotes)
        .expect(201);
      expect(res.body[0].votes).toEqual(0);
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
    test("400: responds with a message when invalid properties present in request body", async () => {
      const updateBody = { inc_votes: "1", name: "mitch" };
      const res = await request(app)
        .patch("/api/reviews/2")
        .send(updateBody)
        .expect(400);
      expect(res.text).toBe('The property "name" is not valid in update body');
    });
  });

  describe("GET /", () => {
    test("200: responds with array of objects with the correct properties", async () => {
      const res = await request(app).get("/api/reviews").expect(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(13);
      res.body.forEach((review) => {
        expect(review).toHaveProperty("owner");
        expect(review).toHaveProperty("title");
        expect(review).toHaveProperty("category");
        expect(review).toHaveProperty("created_at");
        expect(review).toHaveProperty("votes");
        expect(review).toHaveProperty("comment_count");
      });
    });
    test("200: responds with array of objects sorted by review_id", async () => {
      const res = await request(app)
        .get("/api/reviews?sort_by=review_id")
        .expect(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(13);
      expect(res.body).toBeSortedBy("review_id");
    });
    test("200: responds with array of objects sorted by date (created_at) by default", async () => {
      const res = await request(app).get("/api/reviews").expect(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(13);
      expect(res.body).toBeSortedBy("created_at");
    });
    test("400: responds with a message when attempting to sort by an invalid column", async () => {
      const res = await request(app)
        .get("/api/reviews?sort_by=invalidSort")
        .expect(400);
      expect(res.text).toBe(
        'Invalid sort query, column "invalidSort" does not exist'
      );
    });
    test("200: responds with array of objects sorted by votes, in ascending order by default", async () => {
      const res = await request(app)
        .get("/api/reviews?sort_by=votes")
        .expect(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(13);
      expect(res.body).toBeSortedBy("votes", { descending: false });
    });
    test("200: responds with array of objects sorted by votes in descending order", async () => {
      const res = await request(app)
        .get("/api/reviews?sort_by=votes&order=desc")
        .expect(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(13);
      expect(res.body).toBeSortedBy("votes", { descending: true });
    });
    test("400: responds with a message when attempting to order by an invalid value", async () => {
      const res = await request(app)
        .get("/api/reviews?votes&order=invalidOrder")
        .expect(400);
      expect(res.text).toBe(
        'Invalid order by query, cannot order by "invalidOrder"'
      );
    });
    test("200: responds with array of objects filtered by category query", async () => {
      const res = await request(app)
        .get("/api/reviews?category=dexterity")
        .expect(200);
      expect(Array.isArray(res.body)).toBe(true);
      res.body.forEach((review) => {
        expect(review).toHaveProperty("owner");
        expect(review).toHaveProperty("title");
        expect(review).toHaveProperty("category");
        expect(review).toHaveProperty("created_at");
        expect(review).toHaveProperty("votes");
        expect(review).toHaveProperty("comment_count");
        expect(review).toHaveProperty("review_img_url");
        expect(review).toHaveProperty("review_id");
        expect(review.category).toBe("dexterity");
      });
    });
    test("400: responds with a message when category does not exist in database", async () => {
      const res = await request(app)
        .get("/api/reviews?category=invalidCategory")
        .expect(400);
      expect(res.text).toBe(
        'Invalid request, category "invalidCategory" does not exist'
      );
    });
    test("200: responds with an empty array when category exists but does not have any reviews", async () => {
      const res = await request(app)
        .get("/api/reviews?category=children's+games")
        .expect(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(0);
    });
  });

  describe("GET /:review_id/comments", () => {
    test("200: responds with an array of comments for the given review_id", async () => {
      const res = await request(app).get("/api/reviews/2/comments").expect(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(3);
      res.body.forEach((comment) => {
        expect(comment).toHaveProperty("comment_id");
        expect(comment).toHaveProperty("votes");
        expect(comment).toHaveProperty("created_at");
        expect(comment).toHaveProperty("author");
        expect(comment).toHaveProperty("body");
      });
    });
    test("400: responds with a message for invalid comment_id", async () => {
      const res = await request(app)
        .get("/api/reviews/notAnId/comments")
        .expect(400);
      expect(res.body.message).toBe(
        'invalid input syntax for type integer: "notAnId"'
      );
    });
    test("404: responds with a not found for valid value type but non-existent review_id (no comments)", async () => {
      const res = await request(app)
        .get("/api/reviews/99999/comments")
        .expect(404);
      expect(res.text).toBe("Review id 99999 not found");
    });
  });
  describe("POST /:review_id/comments", () => {
    test("200: responds with the posted comment", async () => {
      const postBody = {
        username: "mallionaire",
        body: "Thoroughly enjoyed this game!",
      };
      const res = await request(app)
        .post("/api/reviews/2/comments")
        .send(postBody)
        .expect(201);
      expect(res.body.length).toBe(1);
      res.body.forEach((comment) => {
        expect(comment).toHaveProperty("review_id");
        expect(comment.review_id).toBe(2);
        expect(comment).toHaveProperty("comment_id");
        expect(comment).toHaveProperty("votes");
        expect(comment.votes).toBe(0);
        expect(comment).toHaveProperty("created_at");
        expect(comment).toHaveProperty("author");
        expect(comment.author).toEqual("mallionaire");
        expect(comment).toHaveProperty("body");
        expect(comment.body).toEqual("Thoroughly enjoyed this game!");
      });
    });
    test("400: responds with a message when invalid properties present in post body", async () => {
      const postBody = {
        username: "mallionaire",
        body: "Thoroughly enjoyed this game!",
        age: 30,
      };
      const res = await request(app)
        .post("/api/reviews/2/comments")
        .send(postBody)
        .expect(400);
      expect(res.text).toBe('The property "age" is not valid in post body');
    });
    test("404: responds with a review_id not found for valid value type but non-existent review_id", async () => {
      const postBody = {
        username: "mallionaire",
        body: "Thoroughly enjoyed this game!",
      };
      const res = await request(app)
        .post("/api/reviews/99999/comments")
        .send(postBody)
        .expect(404);
      expect(res.text).toBe("Review id 99999 not found");
    });
    test("404: responds with an error message when attempting to send post request with a username not found", async () => {
      const postBody = {
        username: "williamyap0101",
        body: "Thoroughly enjoyed this game!",
      };
      const res = await request(app)
        .post("/api/reviews/2/comments")
        .send(postBody)
        .expect(404);
      expect(res.text).toBe(
        'Username "williamyap0101" not found in users table'
      );
    });
    test("400: responds with an error message when attempting to send post request with body character length longer than VARCHAR(1000)", async () => {
      const postBody = {
        username: "mallionaire",
        body: "x".repeat(1001),
      };
      const res = await request(app)
        .post("/api/reviews/2/comments")
        .send(postBody)
        .expect(400);
      expect(res.text).toBe("Body text exceeds 1000 characters");
    });
  });
});
