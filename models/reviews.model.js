const db = require("../db/connection");
const { checkExists } = require("../helpers");

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
  const {
    sort_by = "created_at",
    order = "asc",
    category,
    limit = 10,
    page = 1,
  } = query;

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

  const offset = (page - 1) * limit;

  const queryValues = [limit, offset];
  let queryString = `
        SELECT reviews.owner, title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, COUNT(comment_id) AS comment_count
        FROM reviews 
        LEFT JOIN comments ON reviews.review_id = comments.review_id `;
  if (category) {
    queryValues.push(category);
    queryString += "WHERE category = $3 ";
  }
  const queryStringEnd = `
        GROUP BY reviews.review_id
        ORDER BY ${sort_by} ${order.toUpperCase()}`;
  const queryLimitPage = ` LIMIT $1 OFFSET $2;`;

  const fullQueryString = queryString + queryStringEnd + queryLimitPage;

  const { rows } = await db.query(fullQueryString, queryValues);

  let totalCountQuery = fullQueryString.replace(queryLimitPage, ";");
  totalCountQuery = totalCountQuery.replace("$3", "$1");
  queryValues.shift();
  queryValues.shift();

  const totalCountDbQuery = await db.query(totalCountQuery, queryValues);
  const totalCount = totalCountDbQuery.rows.length;

  if (rows.length === 0 && totalCount === 0) {
    const categoryExists = await checkExists("categories", "slug", category);
    if (!categoryExists) {
      return Promise.reject({
        status: 400,
        message: `Invalid request, category "${category}" does not exist`,
      });
    }
  }

  return { reviews: rows, total_count: totalCount };
};

exports.fetchReviewCommentsById = async ({ review_id, query }) => {
  const { limit = 10, page = 1 } = query;

  const offset = (page - 1) * limit;
  const queryValues = [review_id, limit, offset];

  let queryString = `
        SELECT comment_id, votes, created_at, author, body FROM comments
        WHERE review_id = $1
    `;
  const queryLimitPage = ` LIMIT $2 OFFSET $3;`;

  const { rows } = await db.query(queryString + queryLimitPage, queryValues);

  if (rows.length === 0) {
    return Promise.reject({
      status: 404,
      message: `Review id ${review_id} not found`,
    });
  }
  return rows;
};

exports.insertNewComment = async ({ newComment, review_id }) => {
  const { username, body } = newComment;

  const validPostProp = ["username", "body"];
  // check postBody (newComment) properties
  for (let key in newComment) {
    if (!validPostProp.includes(key)) {
      return Promise.reject({
        status: 400,
        message: `The property "${key}" is not valid in post body`,
      });
    }
  }

  const reviewIdExists = await checkExists("reviews", "review_id", review_id);
  if (!reviewIdExists) {
    return Promise.reject({
      status: 404,
      message: `Review id ${review_id} not found`,
    });
  }

  const usernameExists = await checkExists("users", "username", username);
  if (!usernameExists) {
    return Promise.reject({
      status: 404,
      message: `Username "${username}" does not exist`,
    });
  }

  if (body.length > 1000) {
    return Promise.reject({
      status: 400,
      message: "Body text exceeds 1000 characters",
    });
  }

  const queryString = `
        INSERT INTO comments
            (author, review_id, body)
        VALUES
            ($1, $2, $3)
        RETURNING * ;
    `;
  const queryValues = [username, review_id, body];

  const { rows } = await db.query(queryString, queryValues);

  return rows;
};

exports.insertNewReview = async ({ newReview }) => {
  const { owner, title, review_body, designer, category } = newReview;

  const validPostProps = [
    "owner",
    "title",
    "review_body",
    "designer",
    "category",
  ];
  for (let key in newReview) {
    if (!validPostProps.includes(key)) {
      return Promise.reject({
        status: 400,
        message: `The property "${key}" is not valid in post body`,
      });
    }
  }

  const insertString = `
        INSERT into reviews
            (owner, title, review_body, designer, category)
        VALUES
            ($1, $2, $3, $4, $5)
        RETURNING * ;
    `;
  const insertValues = [owner, title, review_body, designer, category];
  const insertResult = await db.query(insertString, insertValues);

  const queryString = `
        SELECT reviews.owner, title, reviews.review_id, review_body, designer, review_img_url, category, reviews.created_at, reviews.votes, COUNT(comment_id) AS comment_count
        FROM reviews 
        LEFT JOIN comments ON reviews.review_id = comments.review_id 
        WHERE reviews.title=$1
        GROUP BY reviews.review_id;
    `;
  const queryValues = [title];
  const { rows } = await db.query(queryString, queryValues);

  return rows;
};
