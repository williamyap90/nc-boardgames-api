const db = require("../db/connection");

exports.fetchCategories = async () => {
  const result = await db.query("SELECT * FROM categories;");
  return result.rows;
};
