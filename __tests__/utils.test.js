const {
  formatData,
  formatCategoryData,
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
  it("Checks original object has not mutated.", () => {
    const test = formatData([
      {
        username: "tickle122",
        name: "Tom Tickle",
        avatar_url:
          "https://www.spiritsurfers.net/monastery/wp-content/uploads/_41500270_mrtickle.jpg",
      },
    ]);
    const testObj = formatData([
      {
        username: "tickle122",
        name: "Tom Tickle",
        avatar_url:
          "https://www.spiritsurfers.net/monastery/wp-content/uploads/_41500270_mrtickle.jpg",
      },
    ]);
    formatData(test);
    expect(test).toEqual(testObj);
  });
  it("Return formatted data in the correct format.", () => {
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
  it("Checks original object has not mutated.", () => {
    const test = formatData([
      {
        slug: "strategy",
        description:
          "Strategy-focused board games that prioritise limited-randomness",
      },
    ]);
    const testObj = formatData([
      {
        slug: "strategy",
        description:
          "Strategy-focused board games that prioritise limited-randomness",
      },
    ]);
    expect(test).toEqual(testObj);
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
