const db = require("../db/connection");

exports.fetchReviewById = async (review_id) => {
  const result = await db.query(
    `
    SELECT reviews.owner, title, reviews.review_id, review_body, designer, review_img_url, category, reviews.created_at, reviews.votes, COUNT(comment_id) AS comment_count
    FROM reviews 
    JOIN comments 
    ON reviews.review_id = comments.review_id 
    WHERE reviews.review_id=$1
    GROUP BY reviews.owner, reviews.title, reviews.review_id;`,
    [review_id]
  );
  return result.rows;
};
