const db = require("../db/connection");

exports.removeCommentById = async ({ comment_id }) => {
  const queryString = `
        DELETE FROM comments
        WHERE comment_id = $1
        RETURNING *;
  `;
  const queryValues = [comment_id];

  const { rows } = await db.query(queryString, queryValues);
  return rows;
};
