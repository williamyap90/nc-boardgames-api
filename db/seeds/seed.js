const db = require("../connection.js");
const format = require("pg-format");
const {
  formatData,
  createCommentsRefObj,
  formatCommentsData,
} = require("../utils/data-manipulation.js");

const seed = async (data) => {
  const { categoryData, commentData, reviewData, userData } = data;
  await db.query("DROP TABLE IF EXISTS comments;");
  await db.query("DROP TABLE IF EXISTS reviews;");
  await db.query("DROP TABLE IF EXISTS users;");
  await db.query("DROP TABLE IF EXISTS categories;");

  await db.query(`
    CREATE TABLE categories (
      slug VARCHAR(100) PRIMARY KEY,
      description VARCHAR(200) NOT NULL
    );
  `);

  await db.query(`
    CREATE TABLE users (
      username VARCHAR(100) PRIMARY KEY,
      avatar_url VARCHAR(200) NOT NULL,
      name VARCHAR(100) NOT NULL
    );
  `);

  await db.query(`
    CREATE TABLE reviews (
      review_id SERIAL PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      review_body VARCHAR(1000) NOT NULL,
      designer VARCHAR(100) NOT NULL,
      review_img_url VARCHAR(200) DEFAULT 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg' NOT NULL,
      votes INT DEFAULT 0 NOT NULL,
      category VARCHAR(100) REFERENCES categories(slug) ON DELETE CASCADE,
      owner VARCHAR(100) REFERENCES users(username) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
     );
  `);

  await db.query(`
    CREATE TABLE comments (
      comment_id SERIAL PRIMARY KEY,
      author VARCHAR(100) REFERENCES users(username) ON DELETE CASCADE NOT NULL,
      review_id INT REFERENCES reviews(review_id) ON DELETE CASCADE NOT NULL,
      votes INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      body VARCHAR(1000) NOT NULL
    );
  `);

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

  const formattedReviewData = formatData(reviewData);
  const reviewInsertString = format(
    `
    INSERT INTO reviews
      (title, designer, owner, review_img_url, review_body, category, created_at, votes)
    VALUES
      %L
    RETURNING *;
  `,
    formattedReviewData
  );
  const reviews = await db.query(reviewInsertString);

  const commentsRefObj = createCommentsRefObj(reviews.rows);

  const formattedCommentsData = formatCommentsData(commentData, commentsRefObj);
  const commentsInsertString = format(
    `
    INSERT INTO comments
      (author, review_id, votes, created_at, body)
    VALUES
      %L
    RETURNING *;
    `,
    formattedCommentsData
  );
  await db.query(commentsInsertString);
};

module.exports = seed;
