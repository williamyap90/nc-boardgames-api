exports.createCategoriesTable = `
    CREATE TABLE categories (
        slug VARCHAR(100) PRIMARY KEY,
        description VARCHAR(200) NOT NULL
    );
`;

exports.createUsersTable = `
    CREATE TABLE users (
        username VARCHAR(100) PRIMARY KEY,
        avatar_url VARCHAR(200) NOT NULL,
        name VARCHAR(100) NOT NULL
    );
`;

exports.createReviewsTable = `
    CREATE TABLE reviews (
        review_id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        review_body VARCHAR(1000) NOT NULL,
        designer VARCHAR(100) NOT NULL,
        review_img_url VARCHAR(200) DEFAULT 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg' NOT NULL,
        votes INT DEFAULT 0,
        category VARCHAR(100) REFERENCES categories(slug) ON DELETE CASCADE,
        owner VARCHAR(100) REFERENCES users(username) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW() 
    );
`;

exports.createCommentsTable = `
    CREATE TABLE comments (
        comment_id SERIAL PRIMARY KEY,
        author VARCHAR(100) REFERENCES users(username) ON DELETE CASCADE NOT NULL,
        review_id INT REFERENCES reviews(review_id) ON DELETE CASCADE NOT NULL,
        votes INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        body VARCHAR(1000) NOT NULL
    );
`;
