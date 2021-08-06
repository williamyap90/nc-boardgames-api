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

  const queryValues = [comment_id];
  const queryString = `
      DELETE FROM comments
      WHERE comment_id = $1
      RETURNING *;
  `;

  const { rows } = await db.query(queryString, queryValues);
  return rows;
};

exports.patchCommentById = async ({ comment_id, updateVotes }) => {
  const { inc_votes } = updateVotes;
  const validUpdates = ["inc_votes"];

  for (let key in updateVotes) {
    if (!validUpdates.includes(key)) {
      return Promise.reject({
        status: 400,
        message: `The property "${key}" is not valid in update body`,
      });
    }
  }

  if (!inc_votes) {
    return Promise.reject({
      status: 400,
      message: "No inc_votes on request body",
    });
  }

  const queryValues = [comment_id, inc_votes];
  const queryString = `
      UPDATE comments
      SET votes = votes + $2
      WHERE comment_id = $1
      RETURNING *;
  `;

  const { rows } = await db.query(queryString, queryValues);
  if (rows.length === 0) {
    return Promise.reject({
      status: 404,
      message: `Comment id "${comment_id}" not found`,
    });
  }
  return rows;
};
