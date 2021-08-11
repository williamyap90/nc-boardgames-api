const { query } = require("../db/connection");
const db = require("../db/connection");
const { checkExists } = require("../helpers");

exports.fetchUsers = async () => {
  const result = await db.query(`SELECT * FROM users;`);
  return result.rows;
};

exports.insertNewUser = async (newUserBody) => {
  const { username, avatar_url, name } = newUserBody;

  const queryString = `
      INSERT INTO users
          (username, avatar_url, name)
      VALUES
          ($1, $2, $3)
      RETURNING *;
    `;
  const queryValues = [username, avatar_url, name];

  const { rows } = await db.query(queryString, queryValues);

  return rows;
};

exports.fetchUserByUsername = async ({ username }) => {
  const usernameExists = await checkExists("users", "username", username);
  if (!usernameExists) {
    return Promise.reject({
      status: 404,
      message: `Username "${username}" does not exist`,
    });
  }

  const queryString = `
      SELECT * FROM users
      WHERE username = $1
    ;`;
  const queryValues = [username];

  const result = await db.query(queryString, queryValues);
  return result.rows;
};

exports.patchUserByUsername = async ({ username, updateUser }) => {
  const { name, avatar_url } = updateUser;

  if (
    (updateUser.hasOwnProperty("name") && name.length === 0) ||
    (updateUser.hasOwnProperty("avatar_url") && avatar_url.length === 0)
  ) {
    return Promise.reject({
      status: 400,
      message: "User body cannot be null",
    });
  }

  const queryValues = [username];
  let queryString = `UPDATE users `;

  if (name) {
    queryValues.push(name);
    queryString += `SET name = $2`;
  }
  if (avatar_url) {
    queryValues.push(avatar_url);
    queryString += `SET avatar_url = $2`;
  }
  queryString += ` WHERE username = $1 RETURNING *;`;

  const { rows } = await db.query(queryString, queryValues);
  return rows;
};
