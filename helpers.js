exports.checkExists = async (table, column, value) => {
  const queryStr = format("SELECT * FROM %I WHERE %I = $1;", table, column);
  const dbOutput = await db.query(queryStr, [value]);

  if (dbOutput.rows.length === 0) {
    return false;
  } else {
    return true;
  }
};

// create reusable functions for Promise.reject with same messages and refactor code
