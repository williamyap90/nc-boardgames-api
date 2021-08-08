const db = require("../db/connection");

exports.fetchCategories = async () => {
  const result = await db.query("SELECT * FROM categories;");
  return result.rows;
};

exports.insertCategory = async ({ slug, description }) => {
  if (!slug || !description) {
    return Promise.reject({
      status: 400,
      message: "Missing required body, check slug & description",
    });
  }

  const queryString = `
      INSERT INTO categories
          (slug, description)
      VALUES
          ($1, $2)
      RETURNING * ;
    `;
  const queryValues = [slug, description];

  const { rows } = await db.query(queryString, queryValues);
  return rows;
};
