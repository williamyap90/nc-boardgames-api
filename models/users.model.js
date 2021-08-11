const db = require("../db/connection");
const { checkExists } = require("../helpers");

exports.fetchUsers = async () => {
  const result = await db.query(`SELECT * FROM users;`);
  return result.rows;
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

exports.patchUserByUsername = async () => {
  console.log("in users model");
};
