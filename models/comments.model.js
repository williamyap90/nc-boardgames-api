const { query } = require("../db/connection");
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
  const { inc_votes, body } = updateVotes;
  const validUpdates = ["inc_votes", "body"];

  for (let key in updateVotes) {
    if (!validUpdates.includes(key)) {
      return Promise.reject({
        status: 400,
        message: `The property "${key}" is not valid in update body`,
      });
    }
  }

  if (updateVotes.hasOwnProperty("body") && body.length === 0) {
    return Promise.reject({
      status: 400,
      message: "Comment body cannot be null",
    });
  }

  if (!inc_votes && !body) {
    return Promise.reject({
      status: 400,
      message: "No valid properties on request body",
    });
  }

  const queryValues = [comment_id];
  let queryString = `UPDATE comments `;

  if (inc_votes) {
    queryValues.push(inc_votes);
    queryString += `SET votes = votes + $2`;
  }
  if (body) {
    queryValues.push(body);
    queryString += `SET body = $2`;
  }
  queryString += ` WHERE comment_id = $1 RETURNING *;`;

  const { rows } = await db.query(queryString, queryValues);
  if (rows.length === 0) {
    return Promise.reject({
      status: 404,
      message: `Comment id "${comment_id}" not found`,
    });
  }
  return rows;
};
