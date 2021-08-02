exports.formatData = (userData) => {
  return userData.map(user => {
    return [user.username, user.name, user.avatar_url];
  })
}

exports.formatCategoryData = (categoryData) => {
  return categoryData.map(cat => {
    return [cat.slug, cat.description];
  });
}

exports.formatReviewData = (reviewData) => {
  
}
