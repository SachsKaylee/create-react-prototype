import * as mod from "./";

// Write unit tests to test your API functions. Each .js file in your library can have a .test.js file.
// Unit tests are powered by Jest - https://jestjs.io/docs/en/getting-started

// Run 'npm run test' for run your unit tests.

describe("The [name] library", () => {

  it("has a name", () => {
    const name = mod.getLibraryName();

    expect(typeof name).toBe("string");
    expect(name.trim()).not.toEqual("");
  });

  it("has the original author", () => {
    const originalAuthor = "[fullname]";
    const currentAuthor = mod.getLibraryAuthor();

    expect(currentAuthor).toEqual(originalAuthor);
  });

});
