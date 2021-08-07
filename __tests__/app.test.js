const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const app = require("../app.js");
const endpointsJSON = require("../endpoints.json");

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
      expect(res.body.endpoints).toEqual(endpointsJSON);
    });
  });
});

describe("/api/categories", () => {
  describe("GET", () => {
    test("200: responds with an array of categories", async () => {
      const res = await request(app).get("/api/categories").expect(200);
      expect(Array.isArray(res.body.result)).toBe(true);
      expect(res.body.result).toHaveLength(4);
      res.body.result.forEach((category) => {
        expect(category).toHaveProperty("slug");
        expect(category).toHaveProperty("description");
      });
    });
  });
});

describe("/api/reviews/:review_id", () => {
  describe("GET", () => {
    test("200: responds with an array of the specified review_id", async () => {
      const res = await request(app).get("/api/reviews/2").expect(200);
      expect(Array.isArray(res.body.review)).toBe(true);
      expect(res.body.review).toHaveLength(1);
    });
    test("200: responds with an array of the specified review_id in the correct format", async () => {
      const res = await request(app).get("/api/reviews/2").expect(200);
      res.body.review.forEach((review) => {
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
  describe("PATCH", () => {
    test("200: responds with the updated object for specified review_id when increasing votes", async () => {
      const updateVotes = { inc_votes: 3 };
      const res = await request(app)
        .patch("/api/reviews/2")
        .send(updateVotes)
        .expect(200);
      expect(res.body.review[0].votes).toEqual(8);
      res.body.review.forEach((review) => {
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
    test("200: responds with the updated object for specified review_id when decreasing votes", async () => {
      const updateVotes = { inc_votes: -100 };
      const res = await request(app)
        .patch("/api/reviews/8")
        .send(updateVotes)
        .expect(200);
      expect(res.body.review[0].votes).toEqual(0);
    });
    test("200: responds with the updated object for specified review_id, with a vote of zero to avoid negative values", async () => {
      const updateVotes = { inc_votes: -100 };
      const res = await request(app)
        .patch("/api/reviews/2")
        .send(updateVotes)
        .expect(200);
      expect(res.body.review[0].votes).toEqual(0);
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
});

describe("/api/reviews", () => {
  describe("GET", () => {
    test("200: responds with array of objects with the correct properties", async () => {
      const res = await request(app).get("/api/reviews").expect(200);
      expect(Array.isArray(res.body.result.reviews)).toBe(true);
      res.body.result.reviews.forEach((review) => {
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
      expect(Array.isArray(res.body.result.reviews)).toBe(true);
      expect(res.body.result.reviews).toBeSortedBy("review_id");
    });
    test("200: responds with array of objects sorted by date (created_at) by default", async () => {
      const res = await request(app).get("/api/reviews").expect(200);
      expect(Array.isArray(res.body.result.reviews)).toBe(true);
      expect(res.body.result.reviews).toBeSortedBy("created_at");
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
      expect(Array.isArray(res.body.result.reviews)).toBe(true);
      expect(res.body.result.reviews).toBeSortedBy("votes", {
        descending: false,
      });
    });
    test("200: responds with array of objects sorted by votes in descending order", async () => {
      const res = await request(app)
        .get("/api/reviews?sort_by=votes&order=desc")
        .expect(200);
      expect(Array.isArray(res.body.result.reviews)).toBe(true);
      expect(res.body.result.reviews).toBeSortedBy("votes", {
        descending: true,
      });
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
      expect(Array.isArray(res.body.result.reviews)).toBe(true);
      res.body.result.reviews.forEach((review) => {
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
      expect(Array.isArray(res.body.result.reviews)).toBe(true);
      expect(res.body.result.reviews.length).toBe(0);
    });
    test("200: returns the number of reviews with default limit value of 10 and defaults to page 1", async () => {
      const res = await request(app).get("/api/reviews").expect(200);
      expect(res.body.result.reviews).toHaveLength(10);
    });
    test("200: returns the number of reviews with limit of 3 and on page 2", async () => {
      const res = await request(app)
        .get("/api/reviews?page=2&limit=3&sort_by=review_id")
        .expect(200);
      expect(res.body.result.reviews).toHaveLength(3);
      expect(res.body.result.reviews[0].review_id).toBe(4);
      expect(res.body.result.reviews[1].review_id).toBe(5);
      expect(res.body.result.reviews[2].review_id).toBe(6);
    });
    test("200: returns the number of reviews with limit of 5 and no page specified (default on page 1)", async () => {
      const res = await request(app)
        .get("/api/reviews?limit=5&sort_by=review_id")
        .expect(200);
      expect(res.body.result.reviews).toHaveLength(5);
      expect(res.body.result.reviews[0].review_id).toBe(1);
      expect(res.body.result.reviews[1].review_id).toBe(2);
      expect(res.body.result.reviews[2].review_id).toBe(3);
      expect(res.body.result.reviews[3].review_id).toBe(4);
      expect(res.body.result.reviews[4].review_id).toBe(5);
    });
    test("200: returns the number of reviews with limit of 3 and on page 2, with a total_count property", async () => {
      const res = await request(app)
        .get("/api/reviews?limit=3&sort_by=review_id&category=social+deduction")
        .expect(200);
      expect(res.body.result).toHaveProperty("reviews");
      expect(res.body.result).toHaveProperty("total_count");
      expect(res.body.result.total_count).toBe(11);
    });
  });
  describe("POST", () => {
    test("201: responds with the newly added review with the correct properties", async () => {
      const postBody = {
        owner: "philippaclaire9",
        title: "Exploding Kittens",
        review_body: "Kitty powered Russian Roulette card game",
        designer: "Elan Lee",
        category: "euro game",
      };
      const res = await request(app)
        .post("/api/reviews")
        .send(postBody)
        .expect(201);
      expect(Array.isArray(res.body.review)).toBe(true);
      expect(res.body.review[0]).toHaveProperty("owner");
      expect(res.body.review[0]).toHaveProperty("title");
      expect(res.body.review[0]).toHaveProperty("review_body");
      expect(res.body.review[0]).toHaveProperty("designer");
      expect(res.body.review[0]).toHaveProperty("category");
      expect(res.body.review[0]).toHaveProperty("review_id");
      expect(res.body.review[0].review_id).toBe(14);
      expect(res.body.review[0]).toHaveProperty("votes");
      expect(res.body.review[0]).toHaveProperty("created_at");
      expect(res.body.review[0]).toHaveProperty("comment_count");
    });
    test("400: responds with a message when invalid properties are present in the body", async () => {
      const postBody = {
        owner: "philippaclaire9",
        title: "Exploding Kittens",
        review_body: "Kitty powered Russian Roulette card game",
        designer: "Elan Lee",
        category: "euro game",
        age: 30,
      };
      const res = await request(app)
        .post("/api/reviews")
        .send(postBody)
        .expect(400);
      expect(res.text).toBe('The property "age" is not valid in post body');
    });
    test("404: responds with an error message when attempting to send post request with a username not found", async () => {
      const postBody = {
        owner: "williamyap0101",
        title: "Exploding Kittens",
        review_body: "Kitty powered Russian Roulette card game",
        designer: "Elan Lee",
        category: "euro game",
      };
      const res = await request(app)
        .post("/api/reviews")
        .send(postBody)
        .expect(404);
      expect(res.text).toBe('Username "williamyap0101" does not exist');
    });
    test.only("400: responds with error message when attempting to post wrong data type for property", () => {
      const postBody = {
        owner: "williamyap0101",
        title: "Exploding Kittens",
        review_body: "Kitty powered Russian Roulette card game",
        designer: "Elan Lee",
        category: "euro game",
      };
      const res = await request(app)
        .post("/api/reviews")
        .send(postBody)
        .expect(400);
    });
  });
});
// 400: responds with an error message when attempting to send post request with body character length longer than VARCHAR(1000)
describe("/api/reviews/:review_id/comments", () => {
  describe("GET", () => {
    test("200: responds with an array of comments for the given review_id", async () => {
      const res = await request(app).get("/api/reviews/2/comments").expect(200);
      expect(Array.isArray(res.body.comments)).toBe(true);
      expect(res.body.comments.length).toBe(3);
      res.body.comments.forEach((comment) => {
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
    test("200: returns the number of comments with limit of 2, default to page 1", async () => {
      const res = await request(app)
        .get("/api/reviews/3/comments?limit=2")
        .expect(200);
      expect(res.body.comments).toHaveLength(2);
      expect(res.body.comments[0].comment_id).toBe(2);
      expect(res.body.comments[1].comment_id).toBe(3);
    });
    test("200: returns the number of comments with limit of 1, page 3", async () => {
      const res = await request(app)
        .get("/api/reviews/3/comments?limit=1&page=3")
        .expect(200);
      expect(res.body.comments).toHaveLength(1);
      expect(res.body.comments[0].comment_id).toBe(6);
    });
  });

  describe("POST", () => {
    test("200: responds with the posted comment", async () => {
      const postBody = {
        username: "mallionaire",
        body: "Thoroughly enjoyed this game!",
      };
      const res = await request(app)
        .post("/api/reviews/2/comments")
        .send(postBody)
        .expect(201);
      expect(res.body.comment.length).toBe(1);
      res.body.comment.forEach((comment) => {
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
      expect(res.text).toBe('Username "williamyap0101" does not exist');
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

describe("/api/comments/:comment_id", () => {
  describe("DELETE", () => {
    test("204: responds with no content, delete the given comment by comment_id", async () => {
      const res = await request(app).delete("/api/comments/3").expect(204);
      const dbCheck = await db.query("SELECT * FROM comments;");
      expect(dbCheck.rows).toHaveLength(5);
    });
    test("400: responds with error when attempting to delete an invalid id type", async () => {
      const res = await request(app)
        .delete("/api/comments/notACommentId")
        .expect(400);
      expect(res.body.message).toBe(
        'invalid input syntax for type integer: "notACommentId"'
      );
    });
    test("404: respond with an error when attempting to delete a comment_id that is valid but does not exist", async () => {
      const res = await request(app).delete("/api/comments/99999").expect(404);
      expect(res.text).toBe(
        'Comment id "99999" not found in the comments table'
      );
    });
  });
  describe("PATCH", () => {
    test("200: responds with updated object with increased votes ", async () => {
      const updateVotes = { inc_votes: 3 };
      const res = await request(app)
        .patch("/api/comments/2")
        .send(updateVotes)
        .expect(200);
      res.body.comment.forEach((comment) => {
        expect(comment).toHaveProperty("comment_id");
        expect(comment).toHaveProperty("author");
        expect(comment).toHaveProperty("review_id");
        expect(comment).toHaveProperty("votes");
        expect(comment).toHaveProperty("created_at");
        expect(comment).toHaveProperty("body");
        expect(comment.author).toBe("mallionaire");
        expect(comment.review_id).toBe(3);
        expect(comment.votes).toBe(16);
      });
    });
    test("200: responds with updated object with decreased votes ", async () => {
      const updateVotes = { inc_votes: -50 };
      const res = await request(app)
        .patch("/api/comments/2")
        .send(updateVotes)
        .expect(200);
      res.body.comment.forEach((comment) => {
        expect(comment).toHaveProperty("comment_id");
        expect(comment).toHaveProperty("author");
        expect(comment).toHaveProperty("review_id");
        expect(comment).toHaveProperty("votes");
        expect(comment).toHaveProperty("created_at");
        expect(comment).toHaveProperty("body");
        expect(comment.author).toBe("mallionaire");
        expect(comment.review_id).toBe(3);
        expect(comment.votes).toBe(-37);
      });
    });
    test("400: responds with a message for invalid comment_id", async () => {
      const updateVotes = { inc_votes: 5 };
      const res = await request(app)
        .patch("/api/comments/notAnId")
        .send(updateVotes)
        .expect(400);
      expect(res.body.message).toBe(
        'invalid input syntax for type integer: "notAnId"'
      );
    });
    test("404: responds with a not found for valid but non-existent comment_id", async () => {
      const updateVotes = { inc_votes: 5 };
      const res = await request(app)
        .patch("/api/comments/99999")
        .send(updateVotes)
        .expect(404);
      expect(res.text).toBe('Comment id "99999" not found');
    });
    test("400: responds with a message for no inc_votes on request body", async () => {
      const updateVotes = {};
      const res = await request(app)
        .patch("/api/comments/2")
        .send(updateVotes)
        .expect(400);
      expect(res.text).toBe("No inc_votes on request body");
    });
    test("400: responds with a message when invalid value provided for inc_votes on request body", async () => {
      const updateVotes = { inc_votes: "cat" };
      const res = await request(app)
        .patch("/api/comments/2")
        .send(updateVotes)
        .expect(400);
      expect(res.body.message).toBe(
        'invalid input syntax for type integer: "cat"'
      );
    });
    test("400: responds with a message when invalid properties present in request body ", async () => {
      const updateVotes = { inc_votes: "1", name: "mitch" };
      const res = await request(app)
        .patch("/api/comments/2")
        .send(updateVotes)
        .expect(400);
      expect(res.text).toBe('The property "name" is not valid in update body');
    });
  });
});

describe("/api/users", () => {
  describe("GET", () => {
    test("200: responds with an array of users", async () => {
      const res = await request(app).get("/api/users").expect(200);
      expect(Array.isArray(res.body.users)).toBe(true);
      res.body.users.forEach((user) => {
        expect(user).toHaveProperty("username");
        expect(user).toHaveProperty("avatar_url");
        expect(user).toHaveProperty("name");
      });
    });
  });
});

describe("/api/users/:username", () => {
  describe("GET", () => {
    test("200: responds with an the user with the specified username", async () => {
      const res = await request(app).get("/api/users/bainesface").expect(200);
      res.body.user.forEach((user) => {
        expect(user).toHaveProperty("username");
        expect(user.username).toBe("bainesface");
        expect(user).toHaveProperty("avatar_url");
        expect(user).toHaveProperty("name");
      });
    });
    test("404: responds with error for username not found", async () => {
      const res = await request(app)
        .get("/api/users/williamyap0101")
        .expect(404);
      expect(res.text).toBe('Username "williamyap0101" does not exist');
    });
  });
});
