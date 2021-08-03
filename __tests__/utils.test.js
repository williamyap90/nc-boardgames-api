const {
  formatData,
  createCommentsRefObj,
  formatCommentsData,
} = require("../db/utils/data-manipulation.js");

describe("formatData(userData)", () => {
  it("Returns a new array", () => {
    const test = formatData([
      {
        username: "tickle122",
        name: "Tom Tickle",
        avatar_url:
          "https://www.spiritsurfers.net/monastery/wp-content/uploads/_41500270_mrtickle.jpg",
      },
    ]);
    expect(typeof test).toBe("object");
  });
  it("Checks original object has not mutated", () => {
    const test = [
      {
        username: "tickle122",
        name: "Tom Tickle",
        avatar_url:
          "https://www.spiritsurfers.net/monastery/wp-content/uploads/_41500270_mrtickle.jpg",
      },
    ];
    const testCopy = [
      {
        username: "tickle122",
        name: "Tom Tickle",
        avatar_url:
          "https://www.spiritsurfers.net/monastery/wp-content/uploads/_41500270_mrtickle.jpg",
      },
    ];
    formatData(test);
    expect(test).toEqual(testCopy);
  });
  it("Return formatted data in the correct format", () => {
    const test = formatData([
      {
        username: "tickle122",
        name: "Tom Tickle",
        avatar_url:
          "https://www.spiritsurfers.net/monastery/wp-content/uploads/_41500270_mrtickle.jpg",
      },
      {
        username: "grumpy19",
        name: "Paul Grump",
        avatar_url:
          "https://www.tumbit.com/profile-image/4/original/mr-grumpy.jpg",
      },
    ]);
    expect(test).toEqual([
      [
        "tickle122",
        "Tom Tickle",
        "https://www.spiritsurfers.net/monastery/wp-content/uploads/_41500270_mrtickle.jpg",
      ],
      [
        "grumpy19",
        "Paul Grump",
        "https://www.tumbit.com/profile-image/4/original/mr-grumpy.jpg",
      ],
    ]);
  });
});

describe("formatData(categoryData)", () => {
  it("Return new array", () => {
    const test = formatData([
      {
        slug: "strategy",
        description:
          "Strategy-focused board games that prioritise limited-randomness",
      },
    ]);
    expect(typeof test).toBe("object");
  });
  it("Checks original object has not mutated", () => {
    const test = [
      {
        slug: "strategy",
        description:
          "Strategy-focused board games that prioritise limited-randomness",
      },
    ];
    const testCopy = [
      {
        slug: "strategy",
        description:
          "Strategy-focused board games that prioritise limited-randomness",
      },
    ];
    formatData(test);
    expect(test).toEqual(testCopy);
  });
  it("Returns formatted data in correct format", () => {
    const test = formatData([
      {
        slug: "strategy",
        description:
          "Strategy-focused board games that prioritise limited-randomness",
      },
    ]);
    expect(test).toEqual([
      [
        "strategy",
        "Strategy-focused board games that prioritise limited-randomness",
      ],
    ]);
  });
});

describe("formatData(reviewData)", () => {
  it("Returns a new array. ", () => {
    const test = formatData([
      {
        title: "Agricola",
        designer: "Uwe Rosenberg",
        owner: "mallionaire",
        review_img_url:
          "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
        review_body: "Farmyard fun!",
        category: "euro game",
        created_at: new Date(1610964020514),
        votes: 1,
      },
    ]);
    expect(typeof test).toBe("object");
  });
  it("Checks original object has not mutated", () => {
    const test = [
      {
        title: "Agricola",
        designer: "Uwe Rosenberg",
        owner: "mallionaire",
        review_img_url:
          "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
        review_body: "Farmyard fun!",
        category: "euro game",
        created_at: new Date(1610964020514),
        votes: 1,
      },
    ];
    const testCopy = [
      {
        title: "Agricola",
        designer: "Uwe Rosenberg",
        owner: "mallionaire",
        review_img_url:
          "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
        review_body: "Farmyard fun!",
        category: "euro game",
        created_at: new Date(1610964020514),
        votes: 1,
      },
    ];
    formatData(test);
    expect(test).toEqual(testCopy);
  });
  it("Returns formatted data in correct format", () => {
    const test = formatData([
      {
        title: "Agricola",
        designer: "Uwe Rosenberg",
        owner: "mallionaire",
        review_img_url:
          "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
        review_body: "Farmyard fun!",
        category: "euro game",
        created_at: new Date(1610964020514),
        votes: 1,
      },
    ]);
    expect(test).toEqual([
      [
        "Agricola",
        "Uwe Rosenberg",
        "mallionaire",
        "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
        "Farmyard fun!",
        "euro game",
        new Date(1610964020514),
        1,
      ],
    ]);
  });
});

describe("createCommentsRefObj()", () => {
  it("Returns a new object", () => {
    const testData = [
      {
        review_id: 24,
        title: "Escape The Dark Sector",
        designer: "Alex Crispin,",
        owner: "jessjelly",
        review_img_url:
          "https://images.pexels.com/photos/596132/pexels-photo-596132.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        review_body: "Argueably one of the best things to come out of 2020...",
        category: "push-your-luck",
        created_at: new Date(1610964545610),
        votes: 11,
      },
    ];
    expect(typeof createCommentsRefObj(testData)).toBe("object");
  });
  it("Checks the original object has not mutated", () => {
    const testData = [
      {
        review_id: 24,
        title: "Escape The Dark Sector",
        designer: "Alex Crispin,",
        owner: "jessjelly",
        review_img_url:
          "https://images.pexels.com/photos/596132/pexels-photo-596132.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        review_body: "Argueably one of the best things to come out of 2020...",
        category: "push-your-luck",
        created_at: new Date(1610964545610),
        votes: 11,
      },
    ];
    const testDataCopy = [
      {
        review_id: 24,
        title: "Escape The Dark Sector",
        designer: "Alex Crispin,",
        owner: "jessjelly",
        review_img_url:
          "https://images.pexels.com/photos/596132/pexels-photo-596132.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        review_body: "Argueably one of the best things to come out of 2020...",
        category: "push-your-luck",
        created_at: new Date(1610964545610),
        votes: 11,
      },
    ];
    createCommentsRefObj(testData);
    expect(testData).toEqual(testDataCopy);
  });
  it("Returns a reference object from the review data", () => {
    const testData = [
      {
        review_id: 24,
        title: "Escape The Dark Sector",
        designer: "Alex Crispin,",
        owner: "jessjelly",
        review_img_url:
          "https://images.pexels.com/photos/596132/pexels-photo-596132.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        review_body: "Argueably one of the best things to come out of 2020...",
        category: "push-your-luck",
        created_at: new Date(1610964545610),
        votes: 11,
      },
    ];
    expect(createCommentsRefObj(testData)).toEqual({
      "Escape The Dark Sector": 24,
    });
  });
});

describe("formatCommentsData()", () => {
  it("Returns a new object", () => {
    const testData = [
      {
        body: "Ex id ipsum dolore non cillum anim sint duis nisi anim deserunt nisi minim. Fugiat sint et proident ex do consequat est. Nisi minim laboris mollit cupidatat.",
        belongs_to: "Escape The Dark Sector",
        created_by: "jessjelly",
        votes: 9,
        created_at: new Date(1616854531110),
      },
    ];
    const testRefObj = { "Escape The Dark Sector": 24 };
    expect(typeof formatCommentsData(testData, testRefObj)).toBe("object");
  });
  it("Checks the original object has not mutated", () => {
    const testData = [
      {
        body: "Ex id ipsum dolore non cillum anim sint duis nisi anim deserunt nisi minim. Fugiat sint et proident ex do consequat est. Nisi minim laboris mollit cupidatat.",
        belongs_to: "Escape The Dark Sector",
        created_by: "jessjelly",
        votes: 9,
        created_at: new Date(1616854531110),
      },
    ];
    const testDataCopy = [
      {
        body: "Ex id ipsum dolore non cillum anim sint duis nisi anim deserunt nisi minim. Fugiat sint et proident ex do consequat est. Nisi minim laboris mollit cupidatat.",
        belongs_to: "Escape The Dark Sector",
        created_by: "jessjelly",
        votes: 9,
        created_at: new Date(1616854531110),
      },
    ];
    const testRefObj = { "Escape The Dark Sector": 24 };
    formatCommentsData(testData, testRefObj);
    expect(testData).toEqual(testDataCopy);
  });
  it("Returns the formatted data in the correct format", () => {
    const testData = [
      {
        body: "Ex id ipsum dolore non cillum anim sint duis nisi anim deserunt nisi minim. Fugiat sint et proident ex do consequat est. Nisi minim laboris mollit cupidatat.",
        belongs_to: "Escape The Dark Sector",
        created_by: "jessjelly",
        votes: 9,
        created_at: new Date(1616854531110),
      },
    ];
    const testRefObj = { "Escape The Dark Sector": 24 };
    expect(formatCommentsData(testData, testRefObj)).toEqual([
      [
        "jessjelly",
        24,
        9,
        new Date(1616854531110),
        "Ex id ipsum dolore non cillum anim sint duis nisi anim deserunt nisi minim. Fugiat sint et proident ex do consequat est. Nisi minim laboris mollit cupidatat.",
      ],
    ]);
  });
});
