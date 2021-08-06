exports.formatData = (data) => {
  if (data.length === 0) return [];

  let result = [];

  data.forEach((item) => {
    let tempArray = [];
    for (let key in item) {
      tempArray.push(item[key]);
    }
    result.push(tempArray);
  });

  return result;
};

exports.createCommentsRefObj = (data) => {
  const commentsRefObj = {};

  data.forEach((review) => {
    commentsRefObj[review["title"]] = review["review_id"];
  });

  return commentsRefObj;
};

exports.formatCommentsData = (data, commentsRefObj) => {
  const result = data.map((comment) => {
    const newComment = { ...comment };

    let commentsTitle = newComment.belongs_to;

    for (let key in commentsRefObj) {
      if (key === commentsTitle) {
        newComment["review_id"] = commentsRefObj[key];
        delete newComment.belongs_to;
      }
    }

    return [
      newComment.created_by,
      newComment.review_id,
      newComment.votes,
      newComment.created_at,
      newComment.body,
    ];
  });
  return result;
};
