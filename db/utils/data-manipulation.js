// exports.formatData = (userData) => {
//   return userData.map((user) => {
//     return [user.username, user.name, user.avatar_url];
//   });
// };

exports.formatData = (data) => {
  let result = [];

  data.map((item) => {
    let tempArray = [];
    for (let key in item) {
      tempArray.push(item[key]);
    }
    result.push(tempArray);
  });

  return result;
};

// exports.formatCategoryData = (categoryData) => {
//   return categoryData.map((cat) => {
//     return [cat.slug, cat.description];
//   });
// };

exports.formatReviewData = (reviewData) => {};
