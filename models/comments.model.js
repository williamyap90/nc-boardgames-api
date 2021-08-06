const db = require("../db/connection");
const { checkExists } = require("../helpers");

exports.removeCommentById = async ({ comment_id }) => {
  const commentIdExists = await checkExists(
    "comments",
    "comment_id",
    comment_id
  );
  if (!commentIdExists) {
    return Promise.reject({
      status: 404,
      message: `Comment id "${comment_id}" not found in the comments table`,
    });
  }

  const queryString = `
        DELETE FROM comments
        WHERE comment_id = $1
        RETURNING *;
  `;
  const queryValues = [comment_id];

  const { rows } = await db.query(queryString, queryValues);
  return rows;
};
