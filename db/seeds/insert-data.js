exports.insertUsers = `
    INSERT INTO users
        (username, name, avatar_url)
    VALUES
        %L
    RETURNING *;
`;

exports.insertCategories = `
    INSERT INTO categories
        (slug, description)
    VALUES
        %L
    RETURNING *;
`;

exports.insertReviews = `
    INSERT INTO reviews
        (title, designer, owner, review_img_url, review_body, category, created_at, votes)
    VALUES
        %L
    RETURNING *;
`;

exports.insertComments = `
    INSERT INTO comments
        (author, review_id, votes, created_at, body)
    VALUES
        %L
    RETURNING *;
`;
