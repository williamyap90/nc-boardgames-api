const db = require("../db/connection");
const format = require("pg-format");

exports.fetchReviewById = async ({ review_id }) => {
  const queryValue = [review_id];
  let queryString = `
        SELECT reviews.owner, title, reviews.review_id, review_body, designer, review_img_url, category, reviews.created_at, reviews.votes, COUNT(comment_id) AS comment_count
        FROM reviews 
        LEFT JOIN comments ON reviews.review_id = comments.review_id 
        WHERE reviews.review_id=$1
        GROUP BY reviews.review_id;
    `;

  const { rows } = await db.query(queryString, queryValue);

  if (rows.length === 0) {
    return Promise.reject({
      status: 404,
      message: `Review id ${review_id} not found`,
    });
  }
  return rows;
};

exports.patchReviewById = async ({ updateBody, review_id }) => {
  const validUpdates = ["inc_votes"];

  // check updateBody properties
  for (let key in updateBody) {
    if (!validUpdates.includes(key)) {
      return Promise.reject({
        status: 400,
        message: `The property "${key}" is not valid in update body`,
      });
    }
  }
  const { inc_votes } = updateBody;

  if (!inc_votes) {
    return Promise.reject({
      status: 400,
      message: "No inc_votes on request body",
    });
  }

  const queryValues = [review_id, inc_votes];

  let queryString = `
        UPDATE reviews
        SET votes = (CASE WHEN (votes + $2) >= 0 THEN votes + $2 ELSE 0 END)
        WHERE review_id = $1
        RETURNING *;
    `;

  const { rows } = await db.query(queryString, queryValues);

  if (rows.length === 0) {
    return Promise.reject({
      status: 404,
      message: `Review id ${review_id} not found`,
    });
  }
  return rows;
};

exports.fetchReviews = async (query) => {
  const { sort_by = "created_at", order = "asc", category } = query;

  const validColumns = [
    "owner",
    "title",
    "review_id",
    "category",
    "review_img_url",
    "created_at",
    "votes",
    "comment_id",
  ];
  if (!validColumns.includes(sort_by)) {
    return Promise.reject({
      status: 400,
      message: `Invalid sort query, column "${sort_by}" does not exist`,
    });
  }

  const validOrder = ["asc", "desc"];
  if (!validOrder.includes(order)) {
    return Promise.reject({
      status: 400,
      message: `Invalid order by query, cannot order by "${order}"`,
    });
  }

  const queryValues = [];

  let queryString = `
        SELECT reviews.owner, title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, COUNT(comment_id) AS comment_count
        FROM reviews 
        LEFT JOIN comments ON reviews.review_id = comments.review_id `;
  if (category) {
    queryValues.push(category);
    queryString += "WHERE category = $1 ";
  }
  let queryStringEnd = `
        GROUP BY reviews.review_id
        ORDER BY ${sort_by} ${order.toUpperCase()};`;

  const { rows } = await db.query(queryString + queryStringEnd, queryValues);

  // may have to change this bit
  if (rows.length === 0) {
    const categoryExists = await checkExists("categories", "slug", category);
    if (!categoryExists) {
      return Promise.reject({
        status: 400,
        message: `Invalid request, category "${category}" does not exist`,
      });
    }
  }
  return rows;
};

exports.fetchReviewCommentsById = async ({ review_id }) => {
  let queryString = `
    SELECT * FROM comments
    WHERE comment_id = $1
    `;
  const queryValues = [review_id];

  const { rows } = await db.query(queryString, queryValues);
  return rows;
};

const checkExists = async (table, column, value) => {
  const queryStr = format("SELECT * FROM %I WHERE %I = $1;", table, column);
  const dbOutput = await db.query(queryStr, [value]);

  if (dbOutput.rows.length === 0) {
    return false;
  } else {
    return true;
  }
};
