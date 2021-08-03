const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const app = require("../app.js");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("/api", () => {
  test("GET - status 200, response from the api endpoint", async () => {
    const res = await request(app).get("/api").expect(200);
    expect(res.body.msg).toBe("All ok from /api");
  });
});

describe("/api/notapath", () => {
  test("404 - returns custom error message", async () => {
    const res = await request(app).get("/api/notapath").expect(404);
    expect(res.body.msg).toBe("invalid path");
  });
});

describe("/api/categories", () => {
  describe("GET", () => {
    test("200, returns a array of categories", async () => {
      const res = await request(app).get("/api/categories").expect(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(4);
    });
  });
});
