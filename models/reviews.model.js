const db = require("../db/connection");

exports.fetchReviewById = async ({ review_id }) => {
  const queryValue = [review_id];
  let queryString = `
        SELECT reviews.owner, title, reviews.review_id, review_body, designer, review_img_url, category, reviews.created_at, reviews.votes, COUNT(comment_id) AS comment_count
        FROM reviews 
        JOIN comments 
        ON reviews.review_id = comments.review_id 
        WHERE reviews.review_id=$1
        GROUP BY reviews.owner, reviews.title, reviews.review_id;
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

exports.patchReviewById = async ({ inc_votes, review_id }) => {
  if (!inc_votes) {
    return Promise.reject({
      status: 400,
      message: "No inc_votes on request body",
    });
  }

  const queryValues = [review_id, inc_votes];
  console.log(queryValues, "id,inc_votes");

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
