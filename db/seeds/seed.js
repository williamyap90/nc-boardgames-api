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
const {
  insertUsers,
  insertReviews,
  insertCategories,
  insertComments,
} = require("./insert-data.js");

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
  const userInsertString = format(insertUsers, formattedUserData);
  await db.query(userInsertString);

  const formattedCategoryData = formatData(categoryData);
  const categoryInsertString = format(insertCategories, formattedCategoryData);
  await db.query(categoryInsertString);

  const formattedReviewData = formatData(reviewData);
  const reviewInsertString = format(insertReviews, formattedReviewData);
  const reviews = await db.query(reviewInsertString);

  const commentsRefObj = createCommentsRefObj(reviews.rows);
  const formattedCommentsData = formatCommentsData(commentData, commentsRefObj);
  const commentsInsertString = format(insertComments, formattedCommentsData);
  await db.query(commentsInsertString);
};

module.exports = seed;
