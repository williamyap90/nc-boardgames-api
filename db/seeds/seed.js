const db = require("../connection.js");
const format = require("pg-format");
const { formatData } = require("../utils/data-manipulation.js");
const {
  categoryData,
  commentData,
  reviewData,
  userData,
} = require("../data/development-data/index.js");

const seed = async (data) => {
  const { categoryData, commentData, reviewData, userData } = data;
  await db.query("DROP TABLE IF EXISTS comments;");
  await db.query("DROP TABLE IF EXISTS reviews;");
  await db.query("DROP TABLE IF EXISTS users;");
  await db.query("DROP TABLE IF EXISTS categories;");

  await db.query(`
    CREATE TABLE categories (
      slug TEXT PRIMARY KEY,
      description VARCHAR(200) NOT NULL
    );
  `);
  console.log("Categories created");

  await db.query(`
    CREATE TABLE users (
      username TEXT PRIMARY KEY,
      avatar_url VARCHAR(200) NOT NULL,
      name VARCHAR(100)
    );
  `);
  console.log("Users created");

  await db.query(`
    CREATE TABLE reviews (
      review_id SERIAL PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      designer VARCHAR(100) NOT NULL,
      review_img_url TEXT DEFAULT 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
      votes INT DEFAULT 0,
      category TEXT REFERENCES categories(slug),
      owner TEXT REFERENCES users(username),
      created_at TIMESTAMP DEFAULT NOW()
     );
  `);
  console.log("Reviews created");

  await db.query(`
    CREATE TABLE comments (
      comment_id INT PRIMARY KEY,
      author TEXT REFERENCES users(username) NOT NULL,
      review_id INT REFERENCES reviews(review_id),
      votes INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      body TEXT
    );
  `);
  console.log("Comments created");

  const formattedUserData = formatData(userData);
  const userInsertString = format(
    `
    INSERT INTO users
      (username, name, avatar_url)
    VALUES
      %L
    RETURNING *;
  `,
    formattedUserData
  );
  await db.query(userInsertString);
  console.log("users inserted");

  const formattedCategoryData = formatData(categoryData);
  const categoryInsertString = format(
    `
    INSERT INTO categories
      (slug, description)
    VALUES
      %L
    RETURNING *;
  `,
    formattedCategoryData
  );
  await db.query(categoryInsertString);
  console.log("categories inserted");

  // FORMAT REVIEW DATA IN PROGRESS
  // Upto below
  // const formattedReviewData = formatReviewData(reviewData);
  // const reviewInsertString = format(
  //   `
  //   INSERT INTO reviews
  //     (title, designer, owner, review_img_url, review_body, category, created_at, votes)
  //   VALUES
  //     %L
  //   RETURNING *;
  // `,
  //   formattedReviewData
  // );
  // console.log(reviewInsertString, "<-- review insert");
  // await db.query(reviewInsertString);
  // console.log("<-- categories inserted");
};

module.exports = seed;
