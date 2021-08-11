const db = require("../db/connection");
const { checkExists } = require("../helpers");

exports.fetchReviews = async (query) => {
  let {
    sort_by = "created_at",
    order = "asc",
    category,
    limit = 10,
    page = 1,
    title,
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

  if (title) title = title[0].toUpperCase() + title.slice(1);

  if (title) {
    const titleExists = await checkExists("reviews", "title", title);
    if (!titleExists) {
      return Promise.reject({
        status: 400,
        message: `Title "${title}" does not exist`,
      });
    }
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

  if (title) {
    queryValues.push(title);
    queryString += "WHERE title = $3 ";
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
        status: 404,
        message: `Category "${category}" does not exist`,
      });
    }
  }

  return { reviews: rows, total_count: totalCount };
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

  const ownerExists = await checkExists("users", "username", owner);
  if (!ownerExists) {
    return Promise.reject({
      status: 404,
      message: `Username "${owner}" does not exist`,
    });
  }

  const categoryExists = await checkExists("categories", "slug", category);
  if (!categoryExists) {
    return Promise.reject({
      status: 404,
      message: `Category "${category}" does not exist`,
    });
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
  const validUpdates = ["inc_votes", "review_body"];

  for (let key in updateBody) {
    if (!validUpdates.includes(key)) {
      return Promise.reject({
        status: 400,
        message: `The property "${key}" is not valid in update body`,
      });
    }
  }

  const { inc_votes, review_body } = updateBody;

  if (updateBody.hasOwnProperty("review_body") && review_body.length === 0) {
    return Promise.reject({
      status: 400,
      message: "Review body cannot be null",
    });
  }

  if (!inc_votes && !review_body) {
    return Promise.reject({
      status: 400,
      message: "No valid properties on request body",
    });
  }

  const queryValues = [review_id];
  let queryString = `UPDATE reviews `;

  if (inc_votes) {
    queryValues.push(inc_votes);
    queryString += `SET votes = (CASE WHEN (votes + $2) >= 0 THEN votes + $2 ELSE 0 END)`;
  }
  if (review_body) {
    queryValues.push(review_body);
    queryString += `SET review_body = $2`;
  }
  queryString += ` WHERE review_id = $1 RETURNING *;`;

  const { rows } = await db.query(queryString, queryValues);

  if (rows.length === 0) {
    return Promise.reject({
      status: 404,
      message: `Review id ${review_id} not found`,
    });
  }
  return rows;
};

exports.removeReviewById = async ({ review_id }) => {
  const queryString = `
        DELETE FROM reviews
        WHERE review_id = $1
        RETURNING *;
    `;
  const queryValues = [review_id];

  const { rows } = await db.query(queryString, queryValues);

  if (rows.length === 0) {
    return Promise.reject({
      status: 404,
      message: `Review id "${review_id}" not found`,
    });
  }
  return rows;
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

  if (!username || !body) {
    return Promise.reject({
      status: 400,
      message: "Missing property on comment post body",
    });
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
