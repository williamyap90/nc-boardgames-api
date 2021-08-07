const db = require("../connection.js");
const format = require("pg-format");
const {
  formatData,
  createCommentsRefObj,
  formatCommentsData,
} = require("../utils/data-manipulation.js");
const {
  createCategoriesTable,
  createUsersTable,
  createReviewsTable,
  createCommentsTable,
} = require("./create-tables.js");

const seed = async (data) => {
  const { categoryData, commentData, reviewData, userData } = data;
  await db.query("DROP TABLE IF EXISTS comments;");
  await db.query("DROP TABLE IF EXISTS reviews;");
  await db.query("DROP TABLE IF EXISTS users;");
  await db.query("DROP TABLE IF EXISTS categories;");

  await db.query(createCategoriesTable);
  await db.query(createUsersTable);
  await db.query(createReviewsTable);
  await db.query(createCommentsTable);

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
